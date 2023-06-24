import React from 'react'
import Button from '@mui/joy/Button'
import { createRoot } from 'react-dom/client'

function App() {
  return <Button variant="solid">Hello World</Button>
}

const domNode = document.getElementById('root')
const root = createRoot(domNode)
root.render(<App />)
