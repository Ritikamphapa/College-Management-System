import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Forwards /api calls to your Express server, so no CORS changes are needed there.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:5000' } },
})
