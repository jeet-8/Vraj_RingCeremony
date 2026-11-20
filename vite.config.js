import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '/client/src': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-chunk': ['three', '@react-three/fiber'],
          'anim-chunk': ['gsap', 'framer-motion', 'lenis'],
          'vendor': ['react', 'react-dom', 'i18next', 'react-i18next'],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
  server: {
    port: 3000,
    host: true,
  },
});
