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
  },
  build: {
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        canvas: path.resolve(__dirname, 'canvas.html'),
      }
    }
  }
})