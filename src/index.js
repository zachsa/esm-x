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

if (!window.Worker) {
  throw new Error(
    "Web workers are not supported in this browser. ESM-X may support workflows that don't require web workers in the future - please request this if you see this error",
  )
}

const scriptURL = document.currentScript.src
const compiler = new Worker(
  scriptURL.substring(0, scriptURL.lastIndexOf('/') + 1) + 'scripts/compiler.js',
  { type: 'module' },
)

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

const NODE_ENV = process.env.NODE_ENV
const isDev = NODE_ENV !== 'production'

window.process = window.process || {}
window.process.env = window.process.env || {}
window.exports = window.exports || {}

const debounce = (cb, duration = 0) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      cb(...args)
    }, duration)
  }
}

const showLoading = tag => tag?.classList.add('esm-x-active')
const hideLoading = debounce(tag => tag?.classList.remove('esm-x-active'), 1000)

async function transpile({ url, source, filename = path.basename(new URL(url).pathname) }) {
  if (isDev) {
    console.info('Transpiling', filename)
  }

  return new Promise((resolve, reject) => {
    try {
      const id = nanoid()

      const handleMessage = e => {
        const { id: _id, transformed } = e.data

        if (_id === id) {
          compiler.removeEventListener('message', handleMessage)
          resolve(transformed)
        }
      }

      compiler.addEventListener('message', handleMessage)
      compiler.postMessage({ id, filename, source })
    } catch (e) {
      reject(e)
    }
  })
}

function initializeESModulesShim(loadingTag) {
  const { fetch: _, shimMode: __, resolve: ___, ...otherOptions } = globalThis.esmsInitOptions || {}

  globalThis.esmsInitOptions = {
    shimMode: true,
    async fetch(url, options) {
      showLoading(loadingTag)
      if (addMsg) {
        addMsg(`${url}`)
      }
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
          const source = await res.text()
          const transformed = await transpile({ url, source })
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
    throw new Error('importmap not detected')
  }

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

async function transpileXModule() {
  const scripts = Array.from(document.querySelectorAll('script[type="esm-x"]'))

  const createAndInsertNewScript = async (script, i) => {
    const newScript = document.createElement('script')
    newScript.type = 'module-shim'
    newScript.innerHTML = await transpile({
      filename: `script-${i}.tsx`,
      source: script.innerHTML,
    })
    script.insertAdjacentElement('afterend', newScript)
  }

  await Promise.all(scripts.map(createAndInsertNewScript))
}

function initializePage(loadingStyle, loadingTag) {
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

      // Wait for transpiler to load
      await new Promise(resolve => {
        compiler.addEventListener('message', resolve, { once: true })
      })

      await transpileXModule()
    },
    /**
     * https://github.com/guybedford/es-module-shims#no-load-event-retriggers
     * Seems like it's a better option to explicitly handle this just for this
     * script
     */
    { once: true },
  )
}

const loadingType =
  document.querySelector('script[id="esm-x"]')?.attributes?.loading?.value || 'circular'
const { style: loadingStyle, tag: loadingTag } = loadingConfig[loadingType]

// Initial setup
initializeESModulesShim(loadingTag)
initializePage(loadingStyle, loadingTag)
showLoading(loadingTag)