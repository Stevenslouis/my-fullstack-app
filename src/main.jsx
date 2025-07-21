import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import AppWrapper from './App.jsx'
import Modal from 'react-modal'
Modal.setAppElement('#root'); 


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>,
)
