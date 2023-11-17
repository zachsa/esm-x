import * as esbuild from 'esbuild-wasm'
import { transform } from '@babel/core'
import presetReact from '@babel/preset-react'
import presetTypescript from '@babel/preset-typescript'

let _wasm

const transpile = async ({ source, filename }) => {
  if (!_wasm) {
    try {
      _wasm = await esbuild.initialize({
        wasmURL: 'http://localhost:3000/node_modules/esbuild-wasm/esbuild.wasm',
        worker: false,
      })
    } catch (error) {}
  }

  return new Promise((resolve, reject) => {
    try {
      const transformed = transform(source, {
        filename: ['.tsx', '.ts', '.js', '.jsx'].some(ext => filename.endsWith(ext))
          ? filename
          : undefined,
        presets: [presetReact, presetTypescript],
      })
      resolve(transformed.code)
    } catch (e) {
      reject(e)
    }
  })
}

self.onmessage = async e => {
  const { id, filename, source } = e.data
  const transformed = await transpile({ source, filename })
  self.postMessage({ id, transformed })
}

// Signal worker ready
self.postMessage(1)
