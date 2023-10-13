export const loadingStyleTag = document.createElement('style')
loadingStyleTag.id = 'esm-x-loading-style'
loadingStyleTag.textContent = `
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

  .esm-x-placeholder {
    display: none;
  }

  .esm-x-active.esm-x-placeholder {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    animation: fadeIn 0.3s ease-out;
  }

  .esm-x-active .esm-x-spinner-container {
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background-color: rgba(0,0,0,0.7);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  }

  .esm-x-active .esm-x-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top-color: #FFF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-top: 8px;
  }

  .esm-x-active .esm-x-title {
    margin: 16px 24px auto;
    font-family: 'monospace';
    color: #FFF;
    font-size: 16px;
  }
  
  .esm-x-active .esm-x-msg {
    margin: 16px 24px auto;
    font-family: 'monospace';
    color: #FFF;
    font-size: 8px;
  }
`

export const loadingTag = document.createElement('div')
export const spinnerContainer = document.createElement('div')
export const spinner = document.createElement('div')
export const title = document.createElement('div')
export const msgContainer = document.createElement('div')

loadingTag.id = 'esm-x-loading'
loadingTag.className = 'esm-x-placeholder'
spinnerContainer.className = 'esm-x-spinner-container'
spinner.className = 'esm-x-spinner'
title.className = 'esm-x-title'
title.textContent = 'ESM-X'
msgContainer.className = 'esm-x-msg'

loadingTag.appendChild(spinnerContainer)
spinnerContainer.appendChild(spinner)
spinnerContainer.appendChild(title)
spinnerContainer.appendChild(msgContainer)

export const setMsg = (msg = '') => {
  msgContainer.innerHTML = msg
}