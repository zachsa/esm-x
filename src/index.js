import { transform } from '@babel/core'
import presetReact from '@babel/preset-react'
import presetTypescript from '@babel/preset-typescript'
import path from 'path'
import { loadingStyleTag, loadingTag } from './loading.js'

window.process = window.process || {}
window.process.env = window.process.env || {}

const debounce = (cb, duration = 0) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      cb(...args)
    }, duration)
  }
}

const addLoading = () => loadingTag.classList.add('esm-x-active')
const removeLoading = debounce(() => loadingTag.classList.remove('esm-x-active'), 500)

function transpile({ url, source, filename = undefined }) {
  filename = filename || path.basename(new URL(url).pathname)
  console.info('Transpiling', filename)
  addLoading()
  const transformed = transform(source, {
    filename: ['.tsx', '.ts', '.js', '.jsx'].some(ext => filename.endsWith(ext))
      ? filename
      : undefined,
    presets: [presetReact, presetTypescript],
  })
  removeLoading()
  return transformed.code
}

function initializeESModulesShim() {
  const {
    fetch: _,
    shimMode: __,
    resolve: ___,
    skip: ____,
    ...otherOptions
  } = globalThis.esmsInitOptions || {}

  globalThis.esmsInitOptions = {
    shimMode: true,
    skip: ['https://ga.jspm.io/'], // TODO should match everything NOT from origin
    async fetch(url, options) {
      const res = await fetch(url, options)
      if (!res.ok) return res
      if (url.includes(globalThis.origin)) {
        const source = await res.text()
        const transformed = await transpile({ url, source })
        return new Response(new Blob([transformed], { type: 'application/javascript' }))
      }
      return res
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
  const script = document.querySelector('script[type="esm-x"]')
  if (script) {
    const transpiledCode = await transpile({ filename: 'script.tsx', source: script.innerHTML })
    script.innerHTML = transpiledCode
    script.setAttribute('type', 'module-shim')
  }
}

function initializePage() {
  document.addEventListener('DOMContentLoaded', async () => {
    if (!document.getElementById('esm-x-loading-style')) {
      document.head.appendChild(loadingStyleTag)
    }
    if (!document.getElementById('esm-x-loading')) {
      document.body.appendChild(loadingTag)
    }
    normalizeImportmap()
    await transpileXModule()
  })
}

// Initial setup
initializeESModulesShim()
initializePage()
