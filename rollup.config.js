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
    },
    {
      format: 'umd',
      file: 'dist/chem-grid.umd.js',
      name: 'chemGrid',
      sourcemap: true
    },
    {
      format: 'umd',
      file: 'dist/chem-grid.umd.min.js',
      name: 'chemGrid',
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  plugins: [
    nodeResolve({
      extensions: ['.js', '.vue']
    }),
    commonJs({
      include: /node_modules/
    }),
    vue(),
    // sass(),
    postcss(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      presets: [
        [
          '@vue/babel-preset-jsx',
          {
            injectH: false
          }
        ],
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'usage',
            modules: false,
            corejs: 3
          }
        ]
      ],
      plugins: [
        [
          '@babel/plugin-transform-runtime',
          {
            regenerator: false
          }
        ]
      ]
    })
  ],
  external: ['vue', 'chem-table-enterprise', 'ag-grid-vue']
};
