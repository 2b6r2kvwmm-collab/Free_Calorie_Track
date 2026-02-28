// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://freecalorietrack.com',
  devToolbar: {
    enabled: false
  },
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    react(),
    mdx()
  ]
});