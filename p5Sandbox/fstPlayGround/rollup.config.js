import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const p5Set = () => {
  return {
    input: './docs/js/rollupInput/p5Input.js',
    output: {
      file: './docs/js/modules/p5.bundle.js',
      format: 'esm',
    },
  plugins: [nodeResolve(), commonjs()],
  };
};



export default [p5Set()];
