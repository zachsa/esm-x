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

// Get all .js files in src/scripts
const scriptFiles = fs
  .readdirSync(`${__dirname}/../src/scripts`)
  .filter(file => file.endsWith('.js'))
  .map(file => `src/scripts/${file}`)

// Transpile each file
await Promise.all(
  scriptFiles.map(async inputFile => {
    const bundle = await rollup({
      external: [],
      input: inputFile,
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

    const outputFile = `dist/scripts/${path.basename(inputFile)}`

    // DEV
    await bundle.write({
      file: `dist/scripts/dev.${path.basename(outputFile)}`,
      format: 'esm',
      sourcemap: true,
      plugins: [
        replace({
          preventAssignment: true,
          'process.env.NODE_ENV': JSON.stringify('development'),
        }),
      ],
    })

    // PROD
    await bundle.write({
      sourcemap: true,
      banner: `/*! * ${name} ${version} */`,
      compact: true,
      file: `dist/scripts/${path.basename(outputFile)}`,
      format: 'esm',
      plugins: [
        terser(),
        replace({
          preventAssignment: true,
          'process.env.NODE_ENV': JSON.stringify('production'),
        }),
      ],
    })
  }),
)
