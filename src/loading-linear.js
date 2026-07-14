export const loadingStyleTag = document.createElement('style')
loadingStyleTag.id = 'esm-x-loading-style'
loadingStyleTag.textContent = `
  @keyframes esm-x-linear-progress {
    0% { transform: translateX(-110%) scaleX(.3); }
    45% { transform: translateX(30%) scaleX(.65); }
    100% { transform: translateX(220%) scaleX(.25); }
  }

  .esm-x-placeholder {
    position: fixed;
    z-index: 2147483647;
    top: 0;
    right: 0;
    left: 0;
    height: 3px;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    background: rgba(99, 102, 241, .12);
    transition: opacity 160ms ease;
  }

  .esm-x-active.esm-x-placeholder {
    opacity: 1;
  }

  .esm-x-bar {
    width: 55%;
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #6366f1, #a78bfa, #818cf8);
    box-shadow: 0 0 14px rgba(99, 102, 241, .8);
    transform-origin: left;
    animation: esm-x-linear-progress 1.35s cubic-bezier(.4, 0, .2, 1) infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .esm-x-bar { animation-duration: 3s; }
  }
`

export const loadingTag = document.createElement('div')
loadingTag.id = 'esm-x-loading'
loadingTag.className = 'esm-x-placeholder'
loadingTag.setAttribute('role', 'progressbar')
loadingTag.setAttribute('aria-label', 'Preparing application')

const bar = document.createElement('div')
bar.className = 'esm-x-bar'
loadingTag.appendChild(bar)
