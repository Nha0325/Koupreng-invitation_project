import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const envDir = fileURLToPath(new URL('./', import.meta.url))
const backendPort = process.env.BACKEND_PORT || '8080'
const frontendUserPort = process.env.FRONTEND_USER_PORT || '5173'
const telegramBotPort = process.env.TELEGRAM_BOT_PORT || '8000'

// When tunnelled through ngrok/cloudflare, VITE_HMR_HOST is set to the
// public hostname so the browser WebSocket connects through the tunnel
// instead of trying localhost directly.
const hmrHost = process.env.VITE_HMR_HOST || undefined

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir,
  server: {
    host: true,
    allowedHosts: ["localhost", ".dev", ".ngrok-free.app", ".ngrok-free.dev", ".trycloudflare.com"],
    hmr: hmrHost
      ? { host: hmrHost, port: 443, protocol: 'wss' }
      : true,
    // Skip ngrok browser-warning interstitial on every response
    headers: {
      'ngrok-skip-browser-warning': 'true',
    },
    proxy: {
      "/api": {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
        headers: {
          Origin: `http://localhost:${frontendUserPort}`,
        },
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', `http://localhost:${frontendUserPort}`)
            proxyReq.setHeader('origin', `http://localhost:${frontendUserPort}`)
          })
        },
      },
      // Proxy uploaded files (profile images, etc.) through Vite to avoid
      // Mixed Content blocks when the page is served over HTTPS (ngrok/cloudflare)
      "/uploads": {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
      },
      "/telegram": {
        target: `http://localhost:${telegramBotPort}`,
        changeOrigin: true,
      },
    },
  },
})
