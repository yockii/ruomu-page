import { defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue"
import { resolve } from 'path';
import Unocss from 'unocss/vite'
import path from 'path'

export default defineConfig ({
  plugins: [vue(), Unocss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    }
  },
  server: {
    port: 3000,
    // /canvas代理到8080端口
    proxy: {
      '/canvas': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1024,
  }
})