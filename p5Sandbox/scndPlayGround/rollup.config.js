import { copy } from '@web/rollup-plugin-copy';


const p5Set = () => {
  return {
    input: './docs/js/bundles/p5bundle.js',
    output: {
      dir: './docs/lib',
      format: 'es',
    },
    plugins: [
      copy({ patterns: '**/*.js', rootDir: 'node_modules/p5/lib' });
    ],
  };
};

//console.log('m');

export default [p5Set()];


/*
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy'

const p5Set = () => {
  return {
    input: './js/bundles/rollupInput/p5Input.js',
    // output: {
    //   file: './js/bundles/p5.bundle.js',
    //   format: 'esm',
    // },
  plugins: [nodeResolve(), commonjs(),
    copy({
        targets: [
        //   { src: 'node_modules/p5/lib', dest: './js/bundles/' },
          { src: 'node_modules/p5/lib/p5.esm.js', dest: './js/bundles/' },
        //   { src: './js/bundles/p5.bundle.js', dest: './js/bundles/fuga' },
        ]
      })
  ],
  };
};



export default [p5Set()];
*/