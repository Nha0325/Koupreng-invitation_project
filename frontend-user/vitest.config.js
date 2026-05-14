import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitest.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/setupTests.js'],
        css: true,
        // Allow `test:run` to succeed before any test files exist (e.g. during
        // early scaffolding tasks). Real test files added in later tasks will
        // run normally.
        passWithNoTests: true,
    },
})
