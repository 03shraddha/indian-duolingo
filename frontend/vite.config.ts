import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
  plugins: [react(), tailwindcss()],
  server: {
    // Proxy /api calls to the FastAPI backend during development
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
