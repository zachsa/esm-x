import { rollup } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import polyfillNode from 'rollup-plugin-polyfill-node'
import { readFileSync, rmSync } from 'fs'
import terser from '@rollup/plugin-terser'

rmSync('dist', { recursive: true })
const { name, version } = JSON.parse(readFileSync('package.json', 'utf8'))

// Transpile
const bundle = await rollup({
  external: [],
  input: 'src/index.js',
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false,
    }),
    json({}),
    commonjs({}),
    polyfillNode({}),
  ],
})

await Promise.resolve([
  // DEV
  bundle.write({
    file: 'dist/dev.index.js',
    format: 'iife',
    name: 'esmx',
    sourcemap: true,
  }),

  // PROD
  bundle.write({
    sourcemap: true,
    banner: `/*!
  * ${name} ${version}
  */`,
    compact: true,
    file: 'dist/index.js',
    format: 'iife',
    plugins: [terser()],
  }),
])
