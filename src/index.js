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

globalThis.esmsInitOptions = {
  ...(globalThis.esmsInitOptions || {}),
  shimMode: true,
  async fetch(url, options) {
    const res = await fetch(url, options)
    if (!res.ok) return res
    const source = await res.text()
    const transformed = await compile(url, source)
    return new Response(new Blob([transformed], { type: 'application/javascript' }))
  },
}