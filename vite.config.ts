import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // 개발 환경: CORS 우회 프록시
      // /api/dust/* → https://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc/*
      '/api/dust': {
        target: 'https://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dust/, ''),
        secure: true,
      },
    },
  },
})


