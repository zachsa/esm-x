import { rollup } from 'rollup'
import nodeResolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
import commonjs from '@rollup/plugin-commonjs'
import polyfillNode from 'rollup-plugin-polyfill-node'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import terser from '@rollup/plugin-terser'
import replace from '@rollup/plugin-replace'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const directory = `${__dirname}/../dist/scripts`

if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory)
}

fs.readdirSync(directory).forEach(file => {
  if (path.extname(file) === '.js') {
    fs.rmSync(path.join(directory, file))
  }
})

const { name, version } = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`, 'utf8'))

// Transpile
const bundle = await rollup({
  external: [],
  input: 'src/scripts/compiler.js',
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
    file: 'dist/scripts/dev.compiler.js',
    format: 'iife',
    name: 'esmx',
    sourcemap: true,
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
  }),

  // PROD
  bundle.write({
    sourcemap: true,
    banner: `/*!
  * ${name} ${version}
  */`,
    compact: true,
    file: 'dist/scripts/compiler.js',
    format: 'iife',
    plugins: [
      terser(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  }),
])
