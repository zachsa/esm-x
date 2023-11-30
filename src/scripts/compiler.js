const scriptURL = import.meta.url

self.onmessage = async e => {
  const { id, filename, source, compilerType } = e.data
  const transpile = await import(
    `${scriptURL.substring(0, scriptURL.lastIndexOf('/') + 1)}${compilerType}.js`
  ).then(({ default: fn }) => fn)
  const transformed = await transpile({ source, filename })
  self.postMessage({ id, transformed })
}

// Signal worker ready
self.postMessage(1)
