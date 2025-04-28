import copy from 'rollup-plugin-copy'

const p5Set = () => {
  return {
    input: './docs/js/bundles/p5bundle.js',
  plugins: [
    copy({
      targets: [
        { src: 'node_modules/p5/lib/p5.esm.js', dest: './docs/lib' },
      ]
    })],
  };
};



export default [p5Set()];