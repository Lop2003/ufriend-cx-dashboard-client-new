// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { TooltipProvider } from '@/components/ui/tooltip'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode> — ปิดชั่วคราว: dev mode จะ mount + รัน useEffect 2 รอบ ทำให้ API ถูกเรียกซ้ำ
  <BrowserRouter>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </BrowserRouter>,
  // </StrictMode>,
)
