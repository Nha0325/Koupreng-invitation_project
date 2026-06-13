import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const envDir = fileURLToPath(new URL('./', import.meta.url))

const hostnameFromUrl = (value) => {
  if (!value) return ''

  try {
    return new URL(value).hostname
  } catch {
    return value.replace(/^https?:\/\//, '').replace(/^wss?:\/\//, '').split('/')[0].split(':')[0]
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir, '')
  const backendPort = process.env.BACKEND_PORT || env.BACKEND_PORT || '8080'
  const frontendUserPort = process.env.FRONTEND_USER_PORT || env.FRONTEND_USER_PORT || '5173'
  const telegramBotPort = process.env.TELEGRAM_BOT_PORT || env.TELEGRAM_BOT_PORT || '8000'
  const publicAppUrl = (process.env.VITE_PUBLIC_APP_URL || env.VITE_PUBLIC_APP_URL || '').trim()
  const hmrHost = hostnameFromUrl(process.env.VITE_HMR_HOST || env.VITE_HMR_HOST || publicAppUrl)
  const shouldUseSecureHmr = hmrHost && hmrHost !== 'localhost' && hmrHost !== '127.0.0.1'

  return {
    plugins: [react(), tailwindcss()],
    envDir,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: true,
      allowedHosts: ["localhost", ".dev", ".ngrok-free.app", ".ngrok-free.dev"],
      hmr: shouldUseSecureHmr
        ? {
            host: hmrHost,
            protocol: "wss",
            clientPort: 443,
          }
        : undefined,
      proxy: {
        "/api": {
          target: `http://127.0.0.1:${backendPort}`,
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
        "/uploads": {
          target: `http://127.0.0.1:${backendPort}`,
          changeOrigin: true,
        },
        "/telegram": {
          target: `http://127.0.0.1:${telegramBotPort}`,
          changeOrigin: true,
        },
      },
    },
  }
})
