import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const isPlaceholder = (value = '') =>
  !value
  || value.startsWith('your-')
  || value.includes('replace_with')

const firstConfigured = (...values) =>
  values.find((value) => !isPlaceholder(value)) || ''

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
  const googleClientId = firstConfigured(
    projectEnv.VITE_GOOGLE_CLIENT_ID,
    rootEnv.VITE_GOOGLE_CLIENT_ID,
    (rootEnv.GOOGLE_CLIENT_IDS || '').split(',')[0].trim(),
  )
  const telegramBotUsername = firstConfigured(
    projectEnv.VITE_TELEGRAM_BOT_USERNAME,
    rootEnv.VITE_TELEGRAM_BOT_USERNAME,
    rootEnv.TELEGRAM_BOT_USERNAME,
  )
  const telegramClientId = firstConfigured(
    projectEnv.VITE_TELEGRAM_CLIENT_ID,
    rootEnv.VITE_TELEGRAM_CLIENT_ID,
    rootEnv.TELEGRAM_CLIENT_ID,
  )

  return {
    plugins: [
      tailwindcss(),
      react()
    ],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
      'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(googleClientId),
      'import.meta.env.VITE_TELEGRAM_CLIENT_ID': JSON.stringify(telegramClientId),
      'import.meta.env.VITE_TELEGRAM_BOT_USERNAME': JSON.stringify(telegramBotUsername),
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
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
