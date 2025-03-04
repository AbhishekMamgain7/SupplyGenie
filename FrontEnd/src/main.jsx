import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './Homepage.css'
import Back from './back.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Back/>
  </StrictMode>
)
