import typescript from '@rollup/plugin-typescript';

export default {
  input: './src/app.ts',
  output: {
    file: './bundle.js',
    format: 'es',
  },
  plugins: [
    typescript()
  ]
}
