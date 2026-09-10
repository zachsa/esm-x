import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { test } from 'node:test'
import vm from 'node:vm'
import babel from '../src/scripts/babel.js'

// Exercise the actual fetch hook without starting the DOM and compiler worker.
const source = await readFile(new URL('../src/index.js', import.meta.url), 'utf8')
const hookSource = source.slice(
  source.indexOf('function initializeESModulesShim('),
  source.indexOf('function normalizeImportmap('),
)

test('compiled modules retain their URL for shim resolution', async t => {
  const server = createServer((req, res) => {
    if (req.url === '/redirect.tsx') {
      res.writeHead(302, { Location: '/src/Runtime.tsx' }).end()
      return
    }
    res.setHeader('Content-Type', 'text/plain')
    res.end("export const load = () => import('./App.tsx'); export const url = import.meta.url;")
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => server.close(resolve)))
  const origin = `http://127.0.0.1:${server.address().port}`
  const context = vm.createContext({
    origin,
    fetch,
    Response,
    Blob,
    URL,
    console,
    showLoading() {},
    hideLoading() {},
    addMsg: undefined,
    transpile: ({ source, url }) => babel({ source, filename: new URL(url).pathname }),
  })
  vm.runInContext(`${hookSource}\ninitializeESModulesShim(undefined, 'babel')`, context)

  for (const [requestPath, finalPath] of [
    ['/src/Runtime.tsx', '/src/Runtime.tsx'],
    ['/zachsmith.co.za/public/src/Runtime.tsx', '/zachsmith.co.za/public/src/Runtime.tsx'],
    ['/redirect.tsx', '/src/Runtime.tsx'],
  ]) {
    await t.test(requestPath, async () => {
      const response = await context.esmsInitOptions.fetch(origin + requestPath, {})
      assert.equal(response.url, origin + finalPath)
      assert.equal(response.headers.get('content-type'), 'application/javascript')
      const code = await response.text()
      assert.match(code, /import\(['"]\.\/App\.tsx['"]\)/)
      assert.match(code, /import\.meta\.url/)
      assert.equal(
        new URL('./App.tsx', response.url).href,
        origin + finalPath.replace('Runtime.tsx', 'App.tsx'),
      )
    })
  }
})

function createHook(overrides = {}) {
  const context = vm.createContext({
    origin: 'https://example.com',
    URL,
    Response,
    Blob,
    showLoading() {},
    hideLoading() {},
    addMsg: undefined,
    fetch: async () => new Response('source'),
    transpile: async () => 'compiled',
    ...overrides,
  })
  vm.runInContext(`${hookSource}\ninitializeESModulesShim(undefined, 'babel')`, context)
  return context.esmsInitOptions
}

test('only same-origin modules are compiled; import maps allow query strings', async () => {
  const response = new Response('{}')
  const hook = createHook({ fetch: async () => response })
  for (const url of [
    'https://example.com/importmap?v=1',
    'https://example.com/config/importmap.json?v=1#map',
    'https://example.com.evil.test/module.js',
    'https://other.test/module.js?origin=https://example.com',
  ]) {
    assert.equal(await hook.fetch(url), response)
  }
  assert.equal(await (await hook.fetch('https://example.com/module.tsx?v=1')).text(), 'compiled')
})

test('redirects to another origin are passed through', async () => {
  const response = new Response('source')
  Object.defineProperty(response, 'url', { value: 'https://cdn.example.com/module.js' })
  const hook = createHook({ fetch: async () => response })
  assert.equal(await hook.fetch('https://example.com/module.js'), response)
})

test('fetch and compilation errors propagate and release loading state', async () => {
  for (const operation of ['fetch', 'transpile']) {
    const error = new Error(`${operation} failed`)
    let loading = 0
    const hook = createHook({
      showLoading: () => loading++,
      hideLoading: () => loading--,
      [operation]: async () => {
        throw error
      },
    })
    await assert.rejects(hook.fetch('https://example.com/module.tsx'), e => e === error)
    assert.equal(loading, 0)
  }
})

test('resolution defaults to the shim and preserves a supplied resolver', () => {
  assert.equal(createHook().resolve, undefined)
  const resolve = () => 'https://example.com/custom.js'
  assert.equal(createHook({ esmsInitOptions: { resolve } }).resolve, resolve)
})

test('startup releases loading state when compilation fails', async () => {
  const error = new Error('Invalid TSX')
  let initialize
  let hidden = 0
  const context = vm.createContext({
    document: {
      addEventListener: (event, callback) => {
        initialize = callback
      },
    },
    normalizeImportmap() {},
    compilerReady: Promise.resolve(),
    transpileXModule: async () => {
      throw error
    },
    hideLoading: () => hidden++,
  })
  const startupSource = source.slice(
    source.indexOf('function initializePage('),
    source.indexOf('const knownCompilers'),
  )
  vm.runInContext(`${startupSource}\ninitializePage(undefined, undefined, 'babel')`, context)
  await assert.rejects(initialize(), e => e === error)
  assert.equal(hidden, 1)
})

test('compiler configuration is normalized before worker dispatch', () => {
  const configSource = source.slice(
    source.indexOf('const compilerType ='),
    source.indexOf('const { style:'),
  )
  for (const value of ['Babel', 'ESBUILD', undefined]) {
    const context = vm.createContext({
      document: { querySelector: () => ({ attributes: { compiler: { value } } }) },
    })
    assert.equal(
      vm.runInContext(`${configSource}\ncompilerType`, context),
      value?.toLowerCase() || 'babel',
    )
  }
})
