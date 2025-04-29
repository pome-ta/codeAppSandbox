import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import localResolve from 'rollup-plugin-local-resolve';
import copy from 'rollup-plugin-copy'


const p5Set = () => {
  return {
    input: './docs/js/bundles/p5bundle.js',
    /*
    output: {
      file: './docs/js/p5.bundle.js',
      format: 'esm',
    },
    */
  plugins: [nodeResolve(), commonjs(), localResolve(),
  copy({
      targets: [
        { src: 'node_modules/p5/lib', dest: './docs/js' },
      ]
    }),
  ],
  };
};

export default [p5Set()];

