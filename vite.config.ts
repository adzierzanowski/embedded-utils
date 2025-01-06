import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    watch: {
      interval: 1000,
      usePolling: true
    }
  },
  plugins: [react()],
})