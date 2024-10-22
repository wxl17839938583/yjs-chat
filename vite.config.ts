import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname,'./src'),
    }
  },
  server: {
    proxy: {
      '/herolist': {
        target: 'https://pvp.qq.com/web201605/js/herolist.json',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/herolist/, '')
      }
    }
  }
})
