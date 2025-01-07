import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return ({
    server: {
      watch: {
        interval: 1000,
        usePolling: true
      }
    },
    base: command === 'build' ? '/embedded-utils' : '',
    build: {
      outDir: 'docs',
    },
    plugins: [react()],
  })
})
