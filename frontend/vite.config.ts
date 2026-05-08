import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { script } from 'framer-motion/client';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

