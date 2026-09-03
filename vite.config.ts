import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4242,
    host: true,
    allowedHosts: ['shine-peerpath.onrender.com', '.onrender.com', 'localhost', '127.0.0.1']
  },
  preview: {
    port: 4242,
    host: true,
    allowedHosts: ['shine-peerpath.onrender.com', '.onrender.com', 'localhost', '127.0.0.1']
  }
})
