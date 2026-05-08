import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  publicDir: false,
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  server: {
    hmr: true,
    watch: {
      usePolling: false,
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
