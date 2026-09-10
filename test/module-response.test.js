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
