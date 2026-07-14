import * as esbuild from 'esbuild-wasm'

await esbuild.initialize({
  wasmURL: new URL('esbuild.wasm', import.meta.url).href,
  worker: false,
})

export default async ({ source, filename }) => {
  const transformed = await esbuild.transform(source, { loader: 'tsx', sourcefile: filename })
  return transformed.code
}
