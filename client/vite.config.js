import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Tách tất cả các thư viện trong node_modules ra một file 'vendor' riêng
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
})