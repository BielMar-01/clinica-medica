import {
  StrictMode,
} from 'react'

import {
  createRoot,
} from 'react-dom/client'

import {
  BrowserRouter,
} from 'react-router'

import {
  AuthProvider,
} from './contexts/AuthContext'

import App from './App'

import './index.css'

const rootElement =
  document.getElementById(
    'root',
  )

if (!rootElement) {
  throw new Error(
    'Elemento root não encontrado',
  )
}

createRoot(
  rootElement,
).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)