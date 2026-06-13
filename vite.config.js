import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use relative base so the production build also works when opened from a
  // sub-path or static host (e.g. GitHub Pages) without extra configuration.
  base: './',
})
