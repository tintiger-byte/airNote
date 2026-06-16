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
      // 경보 API: /api/dust/* → UlfptcaAlarmInqireSvc/*
      '/api/dust': {
        target: 'https://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dust/, ''),
        secure: true,
      },
      // CAI 실시간 API: /api/cai/* → RltmKhaiInfoSvc/*
      '/api/cai': {
        target: 'https://apis.data.go.kr/B552584/RltmKhaiInfoSvc',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cai/, ''),
        secure: true,
      },
    },
  },
})


