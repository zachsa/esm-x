/**
 * Babel 8 uses the explicit `node:` protocol for built-in modules. The node
 * polyfill plugin expects their bare names, so normalize them before Rollup
 * resolves the browser polyfills.
 */
export default function nodeProtocol() {
  return {
    name: 'node-protocol',
    resolveId(source, importer) {
      if (!source.startsWith('node:')) return null

      return this.resolve(source.slice('node:'.length), importer, { skipSelf: true })
    },
  }
}
