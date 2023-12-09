import { defineConfig } from 'tsup';

const entryUrl = 'src/index.ts';
const outDir = 'lib';

const baseConfiguration = defineConfig({
  entry: {
    'optimized-context': entryUrl
  },
  clean: true,
  treeshake: true,
  format: 'cjs',
  platform: 'neutral',
  outDir,
  target: 'es2022'
})

const developmentConfiguration = defineConfig({
  ...baseConfiguration,
  outExtension: () => {
    return {
      js: '.development.js'
    }
  }
});

const productionConfiguration = defineConfig({
  ...baseConfiguration,
  minify: true,
  publicDir: 'npm',
  outExtension: () => {
    return {
      js: '.production.min.js'
    }
  }
});

const dtsConfiguration = defineConfig({
  ...baseConfiguration,
  entry: [entryUrl],
  dts: {
    only: true
  }
});

export default [developmentConfiguration, productionConfiguration, dtsConfiguration];