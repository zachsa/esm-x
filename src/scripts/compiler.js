const scriptURL = new URL(import.meta.url)
const scriptName = scriptURL.pathname.substring(scriptURL.pathname.lastIndexOf('/') + 1)
const compilerPrefix = scriptName.startsWith('dev.') ? 'dev.' : ''

self.onmessage = async e => {
  const { id, filename, source, compilerType } = e.data
  try {
    const compilerURL = new URL(`${compilerPrefix}${compilerType}.js`, scriptURL)
    const transpile = await import(compilerURL.href).then(({ default: fn }) => fn)
    const transformed = await transpile({ source, filename })
    self.postMessage({ id, transformed })
  } catch (error) {
    self.postMessage({
      id,
      error: { message: error.message, stack: error.stack },
    })
  }
}

// Signal worker ready
self.postMessage(1)
