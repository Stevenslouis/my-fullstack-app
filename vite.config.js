import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://quiz-app-backend-7i6n.onrender.com', // Your backend URL
        changeOrigin: true,
        secure: false,
      }
    }
  }
})