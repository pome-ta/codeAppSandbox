import { copy } from '@web/rollup-plugin-copy';

const p5Set = () => {
  return {
    input: './docs/js/bundles/p5bundle.js',
    output: {
      dir: './docs/js/lib',
      format: 'es',
    },
    plugins: [
      copy({ patterns: 'p5.esm.js', rootDir: 'node_modules/p5/lib', }),
    ],
  };
};

export default [p5Set()];
