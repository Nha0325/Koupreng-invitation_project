import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const envDir = fileURLToPath(new URL('./', import.meta.url))
const backendPort = process.env.BACKEND_PORT || '8080'
const frontendUserPort = process.env.FRONTEND_USER_PORT || '5173'
const telegramBotPort = process.env.TELEGRAM_BOT_PORT || '8000'

// https://vite.dev/config/
export default defineConfig({
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
})
