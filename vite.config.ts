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
    chunkSizeWarningLimit: 1600,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/unit_tests/**/*.ts?(x)'], // include all TS/TSX files
    coverage: {
      provider: 'c8',
      reporter: ['text', 'lcov'],
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70,
      all: true,
    },
  },
});
