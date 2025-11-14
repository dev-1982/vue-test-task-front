// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: 'dist',
    cssCodeSplit: false, // bundle CSS into one file
    rollupOptions: {
      output: {
        manualChunks: undefined // single JS bundle
      }
    }
  }
});
