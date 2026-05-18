import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const projectDir = dirname(fileURLToPath(import.meta.url))
  const rootDir = resolve(projectDir, '..')
  const projectEnv = loadEnv(mode, projectDir, '')
  const rootEnv = loadEnv(mode, rootDir, '')
  const apiUrl = projectEnv.VITE_API_URL
    || rootEnv.VITE_API_URL
    || '/api'
  const backendBaseUrl = rootEnv.BACKEND_BASE_URL
    || projectEnv.BACKEND_BASE_URL
    || 'http://localhost:8080'

  return {
    plugins: [tailwindcss(), react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
    },
    server: {
      host: '0.0.0.0',
      port: 5174,
      allowedHosts: ['.ngrok-free.dev', 'siren-devoutly-probe.ngrok-free.dev'],
      proxy: {
        '/api': {
          target: backendBaseUrl,
          changeOrigin: true,
        },
      },
    },
  }
})
