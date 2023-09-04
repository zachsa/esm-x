const { transform } = require('@babel/core')
const presetReact = require('@babel/preset-react')

async function compile(url, source) {
  if (url.includes('http://localhost')) {
    const transformed = transform(source, {
      presets: [presetReact],
    })
    return transformed.code
  }
  return source.replace(/\/\/#.*/, '')
}

globalThis.esmsInitOptions = globalThis.esmsInitOptions || {}
globalThis.esmsInitOptions.shimMode = true
globalThis.esmsInitOptions.mapOverrides = true
globalThis.esmsInitOptions.skip = []

const fetch = globalThis.esmsInitOptions.fetch || globalThis.fetch

globalThis.esmsInitOptions.fetch = async function (url, options) {
  const res = await fetch(url, options)
  if (!res.ok) return res
  const source = await res.text()
  const transformed = await compile(url, source)
  return new Response(new Blob([transformed], { type: 'application/javascript' }))
}

globalThis.esmsInitOptions.resolve = function (id, parentUrl, defaultResolve) {
  return defaultResolve(id, parentUrl)
}
