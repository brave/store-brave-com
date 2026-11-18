import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import sass from 'sass';
import { readdirSync } from 'fs';
import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */ const config = {
  plugins: [
    sveltekit({
      // Consult https://github.com/sveltejs/svelte-preprocess
      // for more information about preprocessors
      preprocess: preprocess({ sass, postcss: true }),
      adapter: adapter(),
      prerender: {
        entries: readdirSync('./src/pages').map((v) => `/${v.replace('.md', '')}`)
      },
      csp: {
        directives: {
          'require-trusted-types-for': ['script'],
          'trusted-types': ['svelte-trusted-html', 'matomo-policy', 'dompurify'],
          'default-src': ['none'],
          'frame-ancestors': ['none'],
          'base-uri': ['none'],
          'img-src': ['self', process.env.PUBLIC_ASSETS_PATH, 'data:'],
          'font-src': ['self'],
          'style-src': ['self', 'unsafe-inline'],
          'form-action': ['self', 'https://checkout.stripe.com'],
          'connect-src': ['self', 'https://analytics.brave.com'],
          'script-src': ['self', 'https://analytics.brave.com']
        }
      }
    })
  ]
};

export default config;
