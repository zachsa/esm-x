import { transform } from '@babel/core'
import presetReact from '@babel/preset-react'
import presetTypescript from '@babel/preset-typescript'

export default async ({ source, filename }) => {
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
