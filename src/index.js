const { transform } = require('@babel/core')
const presetReact = require('@babel/preset-react')
const presetTypescript = require('@babel/preset-typescript')
const path = require('path')

async function compile(url, source) {
  // Extract filename from the URL
  const filenameFromUrl = path.basename(new URL(url).pathname)

  // Check if the filename matches the .tsx or .ts extension
  const hasValidExtension = ['.tsx', '.ts'].some(ext => filenameFromUrl.endsWith(ext))

  const filename = hasValidExtension ? filenameFromUrl : 'file.tsx' // Default to .tsx if no valid extension is found

  const transformed = transform(source, {
    filename: filename,
    presets: [presetReact, presetTypescript],
    // Add any additional plugins or options here if needed for Angular
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
