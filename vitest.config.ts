import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: './src/mock/setup.ts',
  },
})
