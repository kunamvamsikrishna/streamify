import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure proper base path for deployment
  base: '/',
  build: {
    // Ensure proper output for SPA routing
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
