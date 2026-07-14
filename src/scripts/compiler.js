const scriptURL = new URL(import.meta.url)
const scriptName = scriptURL.pathname.substring(scriptURL.pathname.lastIndexOf('/') + 1)
const compilerPrefix = scriptName.startsWith('dev.') ? 'dev.' : ''
const compilers = new Map()

const loadCompiler = async (compilerType, id) => {
  if (!compilers.has(compilerType)) {
    const compilerURL = new URL(`${compilerPrefix}${compilerType}.js`, scriptURL)
    const progress =
      compilerType === 'esbuild' ? 'Loading esbuild WebAssembly…' : `Loading ${compilerType}…`

    self.postMessage({ id, progress })
    compilers.set(
      compilerType,
      import(compilerURL.href).then(({ default: transpile }) => transpile),
    )
  }

  try {
    return await compilers.get(compilerType)
  } catch (error) {
    compilers.delete(compilerType)
    throw error
  }
}

self.onmessage = async e => {
  const { id, filename, source, compilerType } = e.data
  try {
    const transpile = await loadCompiler(compilerType, id)
    self.postMessage({ id, progress: `Compiling ${filename}` })
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
