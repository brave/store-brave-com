import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  test: {
    setupFiles: ['./vitest-request-mocks.ts']
  }
};

export default config;
