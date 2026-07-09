import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: 'src/widget.ts',
      name: 'SilaFragmentInterview',
      formats: ['iife'],
      fileName: () => 'sila-fragment-interview.js'
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
});
