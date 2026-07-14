import { transformAsync } from '@babel/core'
import presetReact from '@babel/preset-react'
import presetTypescript from '@babel/preset-typescript'

export default async ({ source, filename }) => {
  const transformed = await transformAsync(source, {
    filename: ['.tsx', '.ts', '.js', '.jsx'].some(ext => filename.endsWith(ext))
      ? filename
      : undefined,
    presets: [[presetReact, { runtime: 'classic' }], presetTypescript],
  })

  return transformed.code
}
