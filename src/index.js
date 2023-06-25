const { transform } = require('@babel/core')
const presetReact = require('@babel/preset-react')

async function compileJsx(source) {
  const transformed = transform(source, {
    presets: [presetReact],
  })

  return transformed.code
}

globalThis.esmsInitOptions = globalThis.esmsInitOptions || {}
globalThis.esmsInitOptions.shimMode = true
const fetch = globalThis.esmsInitOptions.fetch || globalThis.fetch

globalThis.esmsInitOptions.fetch = async function (url, options) {
  const res = await fetch(url, options)
  if (!res.ok) return res
  const source = await res.text()
  const transformed = await compileJsx(source)
  return new Response(new Blob([transformed], { type: 'application/javascript' }))
}
