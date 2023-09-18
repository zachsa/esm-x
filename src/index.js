const { transform } = require('@babel/core')
const presetReact = require('@babel/preset-react')
const presetTypescript = require('@babel/preset-typescript')
const path = require('path')

window.process = window.process || {}
window.process.env = window.process.env || {}

let placeholderElement
let placeholderStyleElement

function transpile({ url, source, filename = undefined }) {
  filename = filename || path.basename(new URL(url).pathname)
  const transformed = transform(source, {
    filename: ['.tsx', '.ts', '.js', '.jsx'].some(ext => filename.endsWith(ext))
      ? filename
      : undefined,
    presets: [presetReact, presetTypescript],
  })
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

function fadeOutAndRemove(element) {
  element.style.animation = 'fadeOut 0.3s ease-out'
  element.addEventListener('animationend', () => {
    element.remove()
  })
}

async function transpileXModule() {
  const script = document.querySelector('script[type="x-module-shim"]')
  if (script) {
    const transpiledCode = await transpile({ filename: 'script.tsx', source: script.innerHTML })
    script.innerHTML = transpiledCode
    script.setAttribute('type', 'module-shim')
    script.addEventListener('load', () => {
      fadeOutAndRemove(placeholderElement)
    })
  }
}

function initializePage() {
  if (!placeholderStyleElement) {
    placeholderStyleElement = document.createElement('style')
    placeholderStyleElement.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    
      @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
      }

      @keyframes fadeOut {
        from { opacity: 1; }
        to   { opacity: 0; }
      }
    
      .es-module-shims-jsx-placeholder {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        animation: fadeIn 0.3s ease-out;
      }

      .es-module-shims-jsx-spinner-container {
        padding: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        background-color: rgba(0,0,0,0.7);
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
      }
    
      .es-module-shims-jsx-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255, 255, 255, 0.3);
        border-top-color: #FFF;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
      }
    
      .es-module-shims-jsx-title {
        font-family: 'monospace';
        color: #FFF;
        font-size: 16px;
      }`

    document.head.appendChild(placeholderStyleElement)
  }
  document.addEventListener('DOMContentLoaded', async () => {
    if (!placeholderElement) {
      placeholderElement = document.createElement('div')
      const spinnerContainer = document.createElement('div')
      const spinner = document.createElement('div')
      const title = document.createElement('div')

      placeholderElement.className = 'es-module-shims-jsx-placeholder'
      spinnerContainer.className = 'es-module-shims-jsx-spinner-container'
      spinner.className = 'es-module-shims-jsx-spinner'
      title.className = 'es-module-shims-jsx-title'
      title.textContent = 'Loading Application'

      placeholderElement.appendChild(spinnerContainer)
      spinnerContainer.appendChild(spinner)
      spinnerContainer.appendChild(title)
      document.body.appendChild(placeholderElement)
    }
    normalizeImportmap()
    await transpileXModule()
  })
}

// Initial setup
initializeESModulesShim()
initializePage()

