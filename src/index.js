import { nanoid } from 'nanoid'
import path from 'path'
import {
  loadingStyleTag as circularLoadingStyleTag,
  loadingTag as circularLoadingTag,
  setMsg as setMsg_,
  addMsg as addMsg_,
} from './loading-circular.js'
import {
  loadingStyleTag as linearLoadingStyleTag,
  loadingTag as linearLoadingTag,
} from './loading-linear.js'

const NODE_ENV = process.env.NODE_ENV
const isDev = NODE_ENV !== 'production'

if (!window.Worker) {
  throw new Error(
    "Web workers are not supported in this browser. ESM-X may support workflows that don't require web workers in the future - please request this if you see this error",
  )
}

const scriptURL = document.currentScript.src
const compiler = new Worker(
  URL.createObjectURL(
    new Blob(
      [
        `import("${
          scriptURL.substring(0, scriptURL.lastIndexOf('/') + 1) +
          `scripts/${isDev ? 'dev.' : ''}compiler.js`
        }");`,
      ],
      {
        type: 'application/javascript; charset=utf8',
      },
    ),
  ),
  { type: 'module' },
)

// Listen immediately so the worker's ready signal cannot arrive before the
// DOMContentLoaded handler starts waiting for it.
const compilerReady = new Promise((resolve, reject) => {
  const handleReady = () => {
    compiler.removeEventListener('error', handleError)
    resolve()
  }
  const handleError = event => {
    compiler.removeEventListener('message', handleReady)
    reject(event.error || new Error(event.message || 'Compiler worker failed to load'))
  }

  compiler.addEventListener('message', handleReady, { once: true })
  compiler.addEventListener('error', handleError, { once: true })
})

const loadingConfig = {
  disabled: { style: undefined, tag: undefined },
  circular: {
    style: circularLoadingStyleTag,
    tag: circularLoadingTag,
  },
  linear: {
    style: linearLoadingStyleTag,
    tag: linearLoadingTag,
  },
}

const setMsg = typeof setMsg_ === 'undefined' ? undefined : setMsg_
const addMsg = typeof setMsg_ === 'undefined' ? undefined : addMsg_

window.process = window.process || {}
window.process.env = window.process.env || {}
window.exports = window.exports || {}

const loadingType =
  document.querySelector('script[id="esm-x"]')?.attributes?.loading?.value || 'circular'
const compilerType =
  document.querySelector('script[id="esm-x"]')?.attributes?.compiler?.value || 'babel'
const { style: loadingStyle, tag: loadingTag } = loadingConfig[loadingType]

if (isDev) {
  console.info('Using compiler', compilerType)
}

const loadingDelay = loadingType === 'circular' ? 320 : 0
const minimumLoadingTime = loadingType === 'circular' ? 300 : 120
let loadingCount = 0
let loadingTimer
let loadingHideTimer
let loadingShownAt = 0

const showLoading = tag => {
  if (!tag) return

  loadingCount += 1
  clearTimeout(loadingHideTimer)

  if (tag.classList.contains('esm-x-active') || loadingTimer) return

  loadingTimer = setTimeout(() => {
    loadingTimer = undefined
    loadingShownAt = performance.now()
    tag.classList.add('esm-x-active')
  }, loadingDelay)
}

const hideLoading = tag => {
  if (!tag) return

  loadingCount = Math.max(0, loadingCount - 1)
  if (loadingCount > 0) return

  if (loadingTimer) {
    clearTimeout(loadingTimer)
    loadingTimer = undefined
  }

  if (!tag.classList.contains('esm-x-active')) return

  const visibleFor = performance.now() - loadingShownAt
  loadingHideTimer = setTimeout(
    () => tag.classList.remove('esm-x-active'),
    Math.max(0, minimumLoadingTime - visibleFor),
  )
}

async function transpile({
  url,
  source,
  filename = path.basename(new URL(url).pathname),
  compilerType,
}) {
  if (isDev) {
    console.info('Transpiling', filename)
  }
  setMsg?.(`Compiling ${filename}`)

  return new Promise((resolve, reject) => {
    try {
      const id = nanoid()

      const handleMessage = e => {
        const { id: _id, transformed, error, progress } = e.data

        if (_id === id) {
          if (progress) {
            setMsg?.(progress)
            return
          }

          cleanup()
          if (error) {
            reject(new Error(error.message))
          } else {
            resolve(transformed)
          }
        }
      }

      const handleError = event => {
        cleanup()
        reject(event.error || new Error(event.message || 'Compiler worker failed'))
      }

      const cleanup = () => {
        compiler.removeEventListener('message', handleMessage)
        compiler.removeEventListener('error', handleError)
      }

      compiler.addEventListener('message', handleMessage)
      compiler.addEventListener('error', handleError)
      compiler.postMessage({ id, filename, source, compilerType })
    } catch (e) {
      reject(e)
    }
  })
}

function initializeESModulesShim(loadingTag, compilerType) {
  const { fetch: _, shimMode: __, resolve: ___, ...otherOptions } = globalThis.esmsInitOptions || {}

  globalThis.esmsInitOptions = {
    shimMode: true,
    async fetch(url, options) {
      showLoading(loadingTag)
      try {
        const res = await fetch(url, options)
        if (!res.ok) return res

        /**
         * importmap files need to be handled by es-module-shims, all code
         * from the origin is treated as needing to be transpiled
         */
        const isImportMapFile = url.endsWith('importmap') || url.endsWith('importmap.json')
        const isSameOrigin = url.includes(globalThis.origin)
        if (!isImportMapFile && isSameOrigin) {
          addMsg?.(url)
          const source = await res.text()
          const transformed = await transpile({ url, source, compilerType })
          return new Response(new Blob([transformed], { type: 'application/javascript' }))
        }
        return res
      } catch (e) {
        console.error(e)
      } finally {
        hideLoading(loadingTag)
      }
    },
    resolve(id, parentUrl, resolve) {
      if (id.startsWith('./') && !parentUrl) {
        const url = window.location.href
        const newUrl = url.substring(0, url.lastIndexOf('/') + 1) + id.replace('./', '')
        return newUrl
      }
      return resolve(id, parentUrl, resolve)
    },
    ...otherOptions,
  }
}

function normalizeImportmap() {
  const importmap =
    document.querySelector('script[type="importmap"]') ||
    document.querySelector('script[type="importmap-shim"]')

  if (!importmap) {
    console.warn("importmap not detected. This is fine, but obviously imports won't work")
  }

  if (importmap) {
    const content = importmap.innerHTML

    // Ensure there's a script type="importmap"
    let importmapScript = document.querySelector('script[type="importmap"]')
    if (!importmapScript) {
      importmapScript = document.createElement('script')
      importmapScript.setAttribute('type', 'importmap')
      importmapScript.innerHTML = content
      importmap.parentNode.insertBefore(importmapScript, importmap)
    } else {
      importmapScript.innerHTML = content
    }

    // Ensure there's a script type="importmap-shim"
    let importmapShimScript = document.querySelector('script[type="importmap-shim"]')
    if (!importmapShimScript) {
      importmapShimScript = document.createElement('script')
      importmapShimScript.setAttribute('type', 'importmap-shim')
      importmapShimScript.innerHTML = content
      importmap.parentNode.insertBefore(importmapShimScript, importmap)
    } else {
      importmapShimScript.innerHTML = content
    }
  }
}

async function transpileXModule(compilerType) {
  const scripts = Array.from(document.querySelectorAll('script[type="esm-x"]'))

  for (const [i, script] of scripts.entries()) {
    const newScript = document.createElement('script')
    newScript.type = 'module-shim'
    newScript.innerHTML = await transpile({
      filename: `script-${i}.tsx`,
      source: script.innerHTML,
      compilerType,
    })

    // es-module-shims observes dynamically injected module scripts in <head>.
    // Waiting for each load also preserves the source scripts' execution order.
    const loaded = new Promise((resolve, reject) => {
      newScript.addEventListener('load', resolve, { once: true })
      newScript.addEventListener('error', reject, { once: true })
    })
    document.head.appendChild(newScript)
    await loaded
  }
}

function initializePage(loadingStyle, loadingTag, compilerType) {
  document.addEventListener(
    'DOMContentLoaded',
    async () => {
      if (loadingStyle && loadingTag) {
        if (!document.getElementById('esm-x-loading-style')) {
          document.head.appendChild(loadingStyle)
        }
        if (!document.getElementById('esm-x-loading')) {
          document.body.appendChild(loadingTag)
        }
      }

      normalizeImportmap()

      await compilerReady

      await transpileXModule(compilerType)
      hideLoading(loadingTag)
    },
    /**
     * https://github.com/guybedford/es-module-shims#no-load-event-retriggers
     * Seems like it's a better option to explicitly handle this just for this
     * script
     */
    { once: true },
  )
}

const knownCompilers = ['esbuild', 'babel']

if (!knownCompilers.map(s => s.toLowerCase()).includes(compilerType?.toLowerCase())) {
  throw new Error(`Unknown compiler specified. Choose between [${knownCompilers.join(', ')}]`)
}

// Initial setup
showLoading(loadingTag)
setMsg?.(`Starting ${compilerType} compiler…`)
initializeESModulesShim(loadingTag, compilerType)
initializePage(loadingStyle, loadingTag, compilerType)
