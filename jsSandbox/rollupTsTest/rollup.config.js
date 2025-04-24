import typescript from '@rollup/plugin-typescript';

export default {
  input: './src/app.js',
  output: {
    file: './bundle.js',
    format: 'es',
  },
  plugins: [
    typescript()
  ]
}
