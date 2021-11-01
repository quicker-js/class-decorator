import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'dist/esm5/index.js',
  output: [
    {
      name: 'ClassDecorator',
      format: 'umd',
      file: 'dist/bundles/class-transformer.umd.js',
      sourcemap: true,
    },
    {
      name: 'ClassDecorator',
      format: 'umd',
      file: 'dist/bundles/class-transformer.umd.min.js',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [commonjs(), nodeResolve()],
};
