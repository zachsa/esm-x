export const loadingStyleTag = document.createElement('style')
loadingStyleTag.id = 'esm-x-loading-style'
loadingStyleTag.textContent = `
  @keyframes esm-x-orbit {
    to { transform: rotate(360deg); }
  }

  @keyframes esm-x-progress {
    0% { transform: translateX(-110%) scaleX(.35); }
    45% { transform: translateX(35%) scaleX(.65); }
    100% { transform: translateX(220%) scaleX(.25); }
  }

  @keyframes esm-x-pulse {
    50% { opacity: .45; transform: scale(.82); }
  }

  @keyframes esm-x-overlay-in {
    from { opacity: 0; backdrop-filter: blur(0); -webkit-backdrop-filter: blur(0); }
  }

  @keyframes esm-x-card-in {
    from { opacity: 0; transform: translateY(7px) scale(.985); }
  }

  .esm-x-placeholder {
    position: fixed;
    inset: 0;
    z-index: 2147483647;
    display: grid;
    place-items: center;
    padding: 24px;
    box-sizing: border-box;
    color-scheme: dark;
    background:
      radial-gradient(circle at 50% 42%, rgba(99, 102, 241, .12), transparent 38%),
      rgba(8, 10, 16, .38);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    backdrop-filter: blur(0);
    -webkit-backdrop-filter: blur(0);
    transition:
      opacity 180ms ease,
      visibility 0s linear 180ms,
      backdrop-filter 240ms ease;
  }

  .esm-x-active.esm-x-placeholder {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    backdrop-filter: blur(8px) saturate(.85);
    -webkit-backdrop-filter: blur(8px) saturate(.85);
    animation: esm-x-overlay-in 180ms ease both;
  }

  .esm-x-spinner-container {
    width: min(360px, 100%);
    padding: 22px;
    box-sizing: border-box;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, .11);
    border-radius: 18px;
    background: rgba(17, 20, 30, .92);
    box-shadow:
      0 24px 70px rgba(0, 0, 0, .28),
      inset 0 1px 0 rgba(255, 255, 255, .06);
    font-family:
      Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    transform: translateY(0) scale(1);
  }

  .esm-x-active .esm-x-spinner-container {
    animation: esm-x-card-in 220ms cubic-bezier(.2, .8, .2, 1) both;
  }

  .esm-x-heading {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .esm-x-mark {
    position: relative;
    width: 34px;
    height: 34px;
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    border-radius: 10px;
    color: #e7e8ff;
    background: linear-gradient(145deg, #696cff, #484bc4);
    box-shadow: 0 8px 20px rgba(79, 70, 229, .3);
    font: 700 15px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .esm-x-spinner {
    position: absolute;
    inset: -3px;
    border: 1px solid transparent;
    border-top-color: rgba(199, 201, 255, .9);
    border-right-color: rgba(199, 201, 255, .28);
    border-radius: 13px;
    animation: esm-x-orbit 1.35s linear infinite;
  }

  .esm-x-title-group {
    min-width: 0;
  }

  .esm-x-kicker {
    margin: 0 0 3px;
    color: rgba(220, 222, 238, .52);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .15em;
    text-transform: uppercase;
  }

  .esm-x-title {
    margin: 0;
    color: #f6f7fb;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -.01em;
  }

  .esm-x-progress {
    height: 3px;
    margin: 19px 0 15px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(255, 255, 255, .075);
  }

  .esm-x-progress::after {
    content: '';
    display: block;
    width: 56%;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #777aff, #b0a7ff);
    box-shadow: 0 0 12px rgba(129, 123, 255, .7);
    transform-origin: left;
    animation: esm-x-progress 1.4s cubic-bezier(.4, 0, .2, 1) infinite;
  }

  .esm-x-status-row {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
  }

  .esm-x-status-dot {
    width: 6px;
    height: 6px;
    flex: 0 0 auto;
    border-radius: 50%;
    background: #8b8eff;
    box-shadow: 0 0 0 4px rgba(124, 126, 255, .1);
    animation: esm-x-pulse 1.4s ease-in-out infinite;
  }

  .esm-x-msg {
    min-width: 0;
    overflow: hidden;
    color: rgba(225, 227, 238, .68);
    font-size: 12px;
    line-height: 1.4;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .esm-x-count {
    margin-left: auto;
    padding-left: 12px;
    flex: 0 0 auto;
    color: rgba(225, 227, 238, .38);
    font: 10px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  @media (prefers-reduced-motion: reduce) {
    .esm-x-active.esm-x-placeholder,
    .esm-x-active .esm-x-spinner-container,
    .esm-x-spinner,
    .esm-x-progress::after,
    .esm-x-status-dot { animation: none; }
  }
`

export const loadingTag = document.createElement('div')
loadingTag.id = 'esm-x-loading'
loadingTag.className = 'esm-x-placeholder'
loadingTag.setAttribute('role', 'status')
loadingTag.setAttribute('aria-live', 'polite')
loadingTag.setAttribute('aria-label', 'Preparing application')

const spinnerContainer = document.createElement('div')
spinnerContainer.className = 'esm-x-spinner-container'

const heading = document.createElement('div')
heading.className = 'esm-x-heading'

const mark = document.createElement('div')
mark.className = 'esm-x-mark'
mark.setAttribute('aria-hidden', 'true')
mark.append('x')

const spinner = document.createElement('div')
spinner.className = 'esm-x-spinner'
mark.appendChild(spinner)

const titleGroup = document.createElement('div')
titleGroup.className = 'esm-x-title-group'

const kicker = document.createElement('p')
kicker.className = 'esm-x-kicker'
kicker.textContent = 'ESM-X'

const title = document.createElement('p')
title.className = 'esm-x-title'
title.textContent = 'Preparing your app'

const progress = document.createElement('div')
progress.className = 'esm-x-progress'
progress.setAttribute('aria-hidden', 'true')

const statusRow = document.createElement('div')
statusRow.className = 'esm-x-status-row'

const statusDot = document.createElement('span')
statusDot.className = 'esm-x-status-dot'
statusDot.setAttribute('aria-hidden', 'true')

const msgContainer = document.createElement('span')
msgContainer.className = 'esm-x-msg'
msgContainer.textContent = 'Starting compiler…'

const countContainer = document.createElement('span')
countContainer.className = 'esm-x-count'

titleGroup.append(kicker, title)
heading.append(mark, titleGroup)
statusRow.append(statusDot, msgContainer, countContainer)
spinnerContainer.append(heading, progress, statusRow)
loadingTag.appendChild(spinnerContainer)

let moduleCount = 0

const displayName = value => {
  try {
    const url = new URL(value, window.location.href)
    return decodeURIComponent(url.pathname.split('/').pop() || url.hostname)
  } catch {
    return value
  }
}

export const setMsg = (msg = '') => {
  msgContainer.textContent = msg
}

export const addMsg = (msg = '') => {
  moduleCount += 1
  msgContainer.textContent = `Loading ${displayName(msg)}`
  countContainer.textContent = `${moduleCount} ${moduleCount === 1 ? 'module' : 'modules'}`
}
