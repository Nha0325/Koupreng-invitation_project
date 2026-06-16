import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const envDir = fileURLToPath(new URL('../../', import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, envDir, '')
  const backendPort = process.env.BACKEND_PORT || env.BACKEND_PORT || '8080'
  const frontendAdminPort = Number(process.env.FRONTEND_ADMIN_PORT || env.FRONTEND_ADMIN_PORT || 5174)

  return {
    plugins: [react()],
    envDir,
    server: {
      port: frontendAdminPort,
      proxy: {
        "/api": {
          target: `http://localhost:${backendPort}`,
          changeOrigin: true,
        },
      },
    },
  }
})
