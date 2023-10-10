export const loadingStyleTag = document.createElement('style')
loadingStyleTag.id = 'esm-x-loading-style'
loadingStyleTag.textContent = `
  @keyframes slideIn {
    0% { width: 0%; }
    100% { width: 100%; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to   { opacity: 0; }
  }

  .esm-x-placeholder {
    display: none;
  }

  .esm-x-active.esm-x-placeholder {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 2px;  /* Changed height to 2px */
    background-color: rgba(0,0,0,0.7);
    animation: fadeIn 0.3s ease-out;
  }

  .esm-x-active .esm-x-spinner-container {
    display: none;  /* Hide the spinner container */
  }

  .esm-x-active .esm-x-bar {
    height: 100%;
    background-color: #FFF;
    animation: slideIn 1s infinite;  /* Set animation to infinite */
  }`

export const loadingTag = document.createElement('div')
loadingTag.id = 'esm-x-loading'
const bar = document.createElement('div')
loadingTag.className = 'esm-x-placeholder'
bar.className = 'esm-x-bar'
loadingTag.appendChild(bar)
