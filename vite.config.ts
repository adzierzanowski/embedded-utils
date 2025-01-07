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
  base: 'embedded-utils',
  build: {outDir: 'docs'},
  plugins: [react()],
})
