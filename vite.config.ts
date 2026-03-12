import {defineConfig, type UserConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: 'vitest.setup.ts',
    exclude: ['dist/**', 'node_modules/**', 'server/**'],
  }
} as UserConfig)
