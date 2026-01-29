import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
     outDir: 'build',
    chunkSizeWarningLimit: 1600, // 500kb से बढ़ाकर 1.6mb कर दिया
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'c8',      // or 'istanbul'
      reporter: ['text', 'lcov'],
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70
    }
  }
});


