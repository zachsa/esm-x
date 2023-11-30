import * as esbuild from 'esbuild-wasm'

const scriptURL = import.meta.url
await esbuild.initialize({
  wasmURL: `${scriptURL.substring(0, scriptURL.lastIndexOf('/') + 1)}/esbuild.wasm`,
  worker: false,
})

export default async ({ source, filename }) => {
  const transformed = await esbuild.transform(source, { loader: 'tsx' })
  return transformed.code
}
