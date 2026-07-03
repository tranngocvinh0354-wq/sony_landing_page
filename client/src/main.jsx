import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// 1. Import ShopProvider vào đây
import { ShopProvider } from './contexts/ShopContext.jsx' 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Bọc ShopProvider bao quanh App */}
    <ShopProvider>
      <App />
    </ShopProvider>
  </StrictMode>,
)