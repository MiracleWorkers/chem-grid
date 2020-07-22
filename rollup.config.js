import nodeResolve from '@rollup/plugin-node-resolve';
import vue from 'rollup-plugin-vue';
import babel from '@rollup/plugin-babel';
import commonJs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      format: 'cjs',
      file: 'dist/chem-grid.js',
      sourcemap: true
    },
    {
      format: 'cjs',
      file: 'dist/chem-grid.min.js',
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  plugins: [
    nodeResolve(),
    commonJs({
      include: /node_modules/
    }),
    vue(),
    postcss(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue'],
      presets: [
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'usage',
            modules: false,
            corejs: 3
          }
        ],
        ['@vue/babel-preset-jsx']
      ],
      plugins: ['@babel/plugin-transform-runtime']
    })
  ],
  external: ['vue', 'chem-table-enterprise', 'ag-grid-vue']
};
