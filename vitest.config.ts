/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        'src/main.tsx',
        'src/vite-env.d.ts',
        '**/*.d.ts',
        'cypress/',
        'dist/',
        '.{idea,vscode,git,husky}/',
        '*.{config,setup}.{js,ts,mjs}',
        '**/*.{config,setup}.{js,ts,mjs}',
        '**/*.config.*',
        '**/coverage/**',
        '**/build/**',
        '**/dist/**',
        '**/.{git,svn,hg}/**',
        '**/node_modules/**',
        '**/*.{test,spec}.{js,jsx,ts,tsx}',
        '**/__tests__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}',
        '**/src/test/**',
        '**/tests/**'
      ]
    }
  }
})