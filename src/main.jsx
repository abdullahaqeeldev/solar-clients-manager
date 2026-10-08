
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)

// Loading screen (index.html mein #splash) ko fade-out karke hata do.
// performance.now() page shuru hone se ab tak ka time hai, is liye kam az kam 800ms dikhega.
const splash = document.getElementById('splash')
if (splash) {
  const hide = () => {
    splash.classList.add('splash-hide')
    setTimeout(() => splash.remove(), 500)
  }
  // Do frames ka intezar: pehle app paint ho jaye, phir splash fade-out ho
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const wait = Math.max(0, 800 - performance.now())
      setTimeout(hide, wait)
    }),
  )
}
