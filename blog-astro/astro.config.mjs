// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://freecalorietrack.com',
  trailingSlash: 'never', // Ensure consistent URLs without trailing slashes
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