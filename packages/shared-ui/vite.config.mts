import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import Unfonts from 'unplugin-fonts/vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/shared-ui',
  plugins: [
    react(),
    Unfonts({
      google: {
        families: ['Geist']
      }
    }),
    cssInjectedByJsPlugin(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(import.meta.dirname, 'tsconfig.lib.json'),
    }),
  ],
  resolve: {
    alias: {
      '@card-component-demo/shared-models': path.resolve(import.meta.dirname, '../shared-models/src'),
      '@card-component-demo/shared-utils': path.resolve(import.meta.dirname, '../shared-utils/src'),
    },
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [],
  // },
  // Configuration for building your library.
  // See: https://vite.dev/guide/build.html#library-mode
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: '@card-component-demo/shared-ui',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es' as const],
    },
    rolldownOptions: {
      // External packages that should not be bundled into your library.
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    rollupOptions: {
      // Ensure CSS files are included in the build output
      output: {
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
}));
