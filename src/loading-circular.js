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
    margin: 16px;
    width: 650px;
    font-family: 'monospace';
    color: #FFF;
    font-size: 8px;
    max-height: 200px;
    overflow-y: auto;
  }

  /* Style for the scrollbar track/background */
  .esm-x-active .esm-x-msg::-webkit-scrollbar {
    width: 8px;
    background-color: rgba(0,0,0,0.1);
  }
  
  .esm-x-active .esm-x-msg::-webkit-scrollbar-track {
    border-radius: 4px;
    background-color: rgba(0,0,0,0.1);
  }
  
  /* Style for the scrollbar thumb/handle */
  .esm-x-active .esm-x-msg::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.4);
    transition: background-color 0.2s;
  }
  
  .esm-x-active .esm-x-msg::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.6);
  }
  
  /* Firefox */
  .esm-x-active .esm-x-msg {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.4) rgba(0,0,0,0.1);
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
  p.innerHTML = msg
}

const stamp = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const history = 100
let i = 0

export const addMsg = (msg = '') => {
  const p = document.createElement('p')
  p.innerHTML = `${++i} ${stamp()}: ${msg}`
  msgContainer.append(p)

  // Check and remove older messages if they exceed history limit
  while (msgContainer.children.length > history) {
    msgContainer.removeChild(msgContainer.firstChild)
  }

  msgContainer.scrollTop = msgContainer.scrollHeight
}
