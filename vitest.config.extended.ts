/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      './src/__tests__/setup.ts',
      './tests/setup-extended.ts'
    ],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        'tests/',
        '**/*.d.ts',
        'src/vite-env.d.ts',
        'dist/',
        'build/',
        '**/*.config.{js,ts}',
        'src/main.tsx',
        'public/',
        '**/*.stories.{js,ts,tsx}',
        '**/mock*.{js,ts}',
        '**/__mocks__/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
        // Feature-specific thresholds
        'src/components/auth/**': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
        'src/components/music/**': {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
        'src/hooks/**': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90,
        },
      },
    },
    include: [
      'src/**/*.{test,spec}.{js,ts,tsx}',
      'tests/**/*.{test,spec}.{js,ts,tsx}'
    ],
    exclude: [
      'node_modules/',
      'dist/',
      'build/',
      '**/*.config.{js,ts}',
      'tests/e2e/**', // E2E tests run separately
      'tests/performance/**', // Performance tests run separately
    ],
    testTimeout: 10000,
    hookTimeout: 10000,
    pool: 'threads',
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 4,
      },
    },
    // Enable snapshots for visual regression
    snapshotFormat: {
      escapeString: false,
      printBasicPrototype: false,
    },
    // Mock configuration
    deps: {
      inline: ['three', '@react-three/fiber', '@react-three/drei'],
    },
    // Browser mode for testing browser APIs
    browser: {
      enabled: false, // Enable when needed
      name: 'chrome',
      headless: true,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
  // Optimizations for test performance
  esbuild: {
    target: 'node14',
  },
});
