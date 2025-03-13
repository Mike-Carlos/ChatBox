import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',  // Expose to all network interfaces
    port: 3000,
    strictPort: true,  // Ensures the server runs only on port 3000
    proxy: {
    '/api': {
      target: 'http://192.168.40.118:5000',  // Backend URL
      changeOrigin: true,
      secure: false,
    },
  }
},
  define: {
    global: 'window', // Fix for SockJS
  }
})
