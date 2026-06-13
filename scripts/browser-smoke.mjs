import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const userPort = Number(process.env.SMOKE_USER_PORT || 4180);
const adminPort = Number(process.env.SMOKE_ADMIN_PORT || 4280);

const userRoutes = [
  "/",
  "/templates",
  "/templates/royal/preview",
  "/templates/royal/checkout",
  "/dashboard/events",
  "/dashboard/profile",
  "/dashboard/change-password",
  "/dashboard/notifications",
  "/dashboard/packages",
  "/dashboard/payments",
  "/dashboard/invitations/1/budget",
  "/dashboard/invitations/1/check-in",
  "/dashboard/invitations/1/seating",
  "/i/demo-invitation",
  "/i/demo-invitation?token=demo-token",
];

const adminRoutes = [
  "/admin/login",
  "/admin/dashboard",
  "/admin/users",
  "/admin/templates",
  "/admin/invitations",
  "/admin/reports",
  "/admin/system-logs",
];

function npmCommand() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function chromeCandidates() {
  if (process.env.CHROME_PATH) return [process.env.CHROME_PATH];
  if (process.platform === "win32") {
    const programFiles = [
      process.env.ProgramFiles,
      process.env["ProgramFiles(x86)"],
      process.env.LOCALAPPDATA,
    ].filter(Boolean);
    return [
      ...programFiles.map((base) => path.join(base, "Google", "Chrome", "Application", "chrome.exe")),
      ...programFiles.map((base) => path.join(base, "Microsoft", "Edge", "Application", "msedge.exe")),
    ];
  }
  if (process.platform === "darwin") {
    return [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ];
  }
  return ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge"];
}

function findChrome() {
  for (const candidate of chromeCandidates()) {
    if (candidate.includes(path.sep) && !existsSync(candidate)) continue;
    const result = spawnSync(candidate, ["--version"], { encoding: "utf8", shell: false });
    if (result.status === 0) return candidate;
  }
  throw new Error("No Chrome/Edge executable found. Set CHROME_PATH to run browser smoke.");
}

function startPreview(projectDir, port) {
  const child = spawn(npmCommand(), ["run", "preview", "--", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    cwd: path.join(root, projectDir),
    stdio: ["ignore", "pipe", "pipe"],
    shell: process.platform === "win32",
  });
  child.stdout.on("data", () => {});
  child.stderr.on("data", () => {});
  return child;
}

function waitForPreview(port, timeoutMs = 30000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const req = http.get({ host: "127.0.0.1", port, path: "/", timeout: 1500 }, (res) => {
        res.resume();
        if (res.statusCode === 200) return resolve();
        retry();
      });
      req.on("error", retry);
      req.on("timeout", () => {
        req.destroy();
        retry();
      });
    };
    const retry = () => {
      if (Date.now() - started > timeoutMs) {
        reject(new Error(`Preview on port ${port} did not become ready`));
      } else {
        setTimeout(tryOnce, 500);
      }
    };
    tryOnce();
  });
}

function dumpDom(chrome, url) {
  const profile = mkdtempSync(path.join(os.tmpdir(), "koupreng-smoke-"));
  try {
    const result = spawnSync(chrome, [
      "--headless=new",
      "--disable-gpu",
      "--disable-extensions",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${profile}`,
      "--virtual-time-budget=7000",
      "--dump-dom",
      url,
    ], { encoding: "utf8", maxBuffer: 10 * 1024 * 1024, timeout: 25000 });
    return {
      status: result.status,
      error: result.error,
      stdout: result.stdout || "",
      stderr: result.stderr || "",
    };
  } finally {
    rmSync(profile, { recursive: true, force: true });
  }
}

function stopPreview(child) {
  if (!child?.pid) return;
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore" });
    return;
  }
  child.kill("SIGTERM");
}

function inspectDom(dom) {
  const hasRoot = /<div[^>]+id=["']root["'][^>]*>/i.test(dom);
  const blankRoot = /<div[^>]+id=["']root["'][^>]*>\s*<\/div>/i.test(dom);
  const rendered = hasRoot && !blankRoot;
  return { hasRoot, rendered, bytes: dom.length };
}

async function main() {
  const chrome = findChrome();
  const previews = [
    startPreview("apps/frontend-user", userPort),
    startPreview("apps/frontend-admin", adminPort),
  ];
  try {
    await Promise.all([waitForPreview(userPort), waitForPreview(adminPort)]);
    const checks = [
      ...userRoutes.map((route) => ({ app: "user", base: `http://127.0.0.1:${userPort}`, route })),
      ...adminRoutes.map((route) => ({ app: "admin", base: `http://127.0.0.1:${adminPort}`, route })),
    ];
    const results = checks.map((check) => {
      const url = `${check.base}${check.route}`;
      const dump = dumpDom(chrome, url);
      if (dump.error) {
        return { ...check, status: 1, hasRoot: false, rendered: false, bytes: 0 };
      }
      const dom = inspectDom(dump.stdout);
      return { ...check, status: dump.status, ...dom };
    });
    console.table(results.map(({ app, route, status, hasRoot, rendered, bytes }) => ({
      app, route, status, hasRoot, rendered, bytes,
    })));
    const failures = results.filter((result) => result.status !== 0 || !result.hasRoot || !result.rendered);
    if (failures.length) {
      throw new Error(`Browser smoke failed for: ${failures.map((item) => `${item.app}:${item.route}`).join(", ")}`);
    }
  } finally {
    for (const child of previews) {
      stopPreview(child);
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
