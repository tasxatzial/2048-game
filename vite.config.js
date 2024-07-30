import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  root: "src",
  base: "/2048-game/",
  build: {
    emptyOutDir: true,
    outDir: '../dist',
    assetsInlineLimit: 0,
  },
  test: {
    include: ['../tests/**/*.test.js'],
    coverage: {
      enabled: true,
      reportsDirectory: "../coverage",
      reporter: ['html']
    },
  }
})
