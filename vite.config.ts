import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    // For GitHub Pages deployment:
    // If deploying to a custom domain (e.g. wedding.com) or username.github.io, keep base as '/' or './'
    // If deploying to a project repository (e.g. username.github.io/YOUR_REPOSITORY_NAME/),
    // replace './' below with '/YOUR_REPOSITORY_NAME/'
    base: process.env.GITHUB_PAGES === 'true' ? '/YOUR_REPOSITORY_NAME/' : './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
