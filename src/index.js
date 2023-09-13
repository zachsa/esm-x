const { transform } = require('@babel/core')
const presetReact = require('@babel/preset-react')

async function compile(url, source) {
  const transformed = transform(source, {
    presets: [presetReact],
  })
  return transformed.code
}

globalThis.esmsInitOptions = {
  ...(globalThis.esmsInitOptions || {}),
  shimMode: true, // This gets enabled by the presence of <script type="module-shim">
  async fetch(url, options) {
    const res = await fetch(url, options)
    if (!res.ok) return res
    if (url.includes('http://localhost')) {
      const source = await res.text()
      const transformed = await compile(url, source)
      return new Response(new Blob([transformed], { type: 'application/javascript' }))
    }
    return res
  },
}
