import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))  // 为 src 创建一个别名
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://111.231.168.12:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },

      // '/account/login': {
      //   target: 'http://127.0.0.1:8000',
      //   changeOrigin: true,
      // },
      // '/backend': {
      //   target: 'http://127.0.0.1:8000',
      //   changeOrigin: true,
      // }
    }
  }
});
