// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'prod',
    emptyOutDir: true
  },
  // If deploying under a sub-path (e.g., example.com/app/), set:
  // base: '/app/'
})
