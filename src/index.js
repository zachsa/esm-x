import * as acorn from 'acorn'
import jsx from 'acorn-jsx'

// TODO
function jsxCompile(source) {
  const result = acorn.Parser.extend(jsx()).parse(source)
  return result
}

globalThis.esmsInitOptions = globalThis.esmsInitOptions || {}
globalThis.esmsInitOptions.shimMode = true

const fetch = globalThis.esmsInitOptions.fetch || globalThis.fetch

globalThis.esmsInitOptions.fetch = async function (url, options) {
  const res = await fetch(url, options)
  if (!res.ok) return res
  const source = await res.text()
  const transformed = jsxCompile(source)

  return new Response(new Blob([transformed], { type: 'application/javascript' }))
}
