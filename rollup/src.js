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

const directory = `${__dirname}/../dist`

if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true })
}

fs.readdirSync(directory).forEach(file => {
  if (path.extname(file) === '.js') {
    fs.rmSync(path.join(directory, file))
  }
})

const { name, version } = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`, 'utf8'))

const NODE_ENVS = ['production', 'development']

await Promise.all(
  NODE_ENVS.map(async NODE_ENV => {
    const OUTPUT = NODE_ENV === 'production' ? 'dist/index.js' : 'dist/dev.index.js'
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
        replace({
          preventAssignment: true,
          'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        }),
      ],
    })

    await bundle.write({
      sourcemap: true,
      banner: `/*!
* ${name} ${version}
*/`,
      compact: true,
      file: OUTPUT,
      format: 'iife',
      name: 'esmx',
      plugins: [NODE_ENV === 'production' ? terser() : undefined].filter(Boolean),
    })
  }),
)
