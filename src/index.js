const { transform } = require('@babel/core')
const presetReact = require('@babel/preset-react')

async function jsxCompile(url, source) {
  console.info(
    'es-module-shims-jsx-plugin',
    `[${new Date().toISOString()}] Compiling source from ${url}`
  )
  const transformed = transform(source, {
    presets: [presetReact],
  })

  return transformed.code
}

globalThis.esmsInitOptions = globalThis.esmsInitOptions || {}
globalThis.esmsInitOptions.shimMode = true
globalThis.esmsInitOptions.skip = false
const fetch = globalThis.esmsInitOptions.fetch || globalThis.fetch

globalThis.esmsInitOptions.fetch = async function (url, options) {
  const res = await fetch(url, options)
  if (!res.ok) return res
  const source = await res.text()
  const transformed = await jsxCompile(url, source)
  return new Response(new Blob([transformed], { type: 'application/javascript' }))
}
