import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const rootEnvDir = fileURLToPath(new URL('..', import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootEnvDir, 'BACKEND_BASE_URL')

  return {
    envDir: rootEnvDir,
    plugins: [tailwindcss(), react()],
    server: {
      port: 5173,
      strictPort: true,
      allowedHosts: ['.ngrok-free.dev'],
      proxy: {
        '/api': {
          target: env.BACKEND_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
  }
})
