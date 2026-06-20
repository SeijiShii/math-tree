import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import { bootstrapSession } from './app/bootstrap'
import './styles/tokens.css'

// P4.46: 起動で匿名ゲストセッションを確立（0 タップ学習開始）
bootstrapSession()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
