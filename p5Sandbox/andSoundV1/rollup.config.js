import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const p5Set = () => {
  return {
    input: './docs/js/srcBundles/p5Bundles.js',
    output: {
      file: './docs/js/lib/p5.bundle.js',
      format: 'esm',
    },
    plugins: [nodeResolve(), commonjs(),],
  };
};

const soundSet = () => {
  return {
    input: './docs/js/srcBundles/p5SoundBundles.js',
    output: {
      file: './docs/js/lib/addons/p5sound.bundle.js',
      format: 'iife',
    },
    plugins: [nodeResolve(), commonjs(),],
  };
};


export default [p5Set(), soundSet(),];
// export default [soundSet(),];
