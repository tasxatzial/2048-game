import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  base: '/2048-game/',
  build: {
    emptyOutDir: true,
    outDir: '../dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, './src/index.html'),
        colors: resolve(__dirname, './src/colors.html'),
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['../tests/**/*.test.js'],
    coverage: {
      enabled: true,
      reportsDirectory: '../coverage',
      reporter: ['html']
    },
  }
})
