import { transform } from '@babel/core'
import presetReact from '@babel/preset-react'
import presetTypescript from '@babel/preset-typescript'

const transpile = async ({ source, filename }) =>
  new Promise((resolve, reject) => {
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

self.onmessage = async e => {
  const { id, filename, source } = e.data
  const transformed = await transpile({ source, filename })
  self.postMessage({ id, transformed })
}

// Signal worker ready
self.postMessage(1)
