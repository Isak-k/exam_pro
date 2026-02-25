import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✓ Service Worker registered:', registration.scope);
        setInterval(() => {
          registration.update();
        }, 60000);
      })
      .catch((error) => {
        console.error('✗ Service Worker registration failed:', error);
      });
  });
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('✓ Service Worker updated - reloading page');
    window.location.reload();
  });
}

// Handle online/offline events
window.addEventListener('online', () => {
  console.log('✓ Back online');
  document.body.classList.remove('offline');
  document.body.classList.add('online');
});

window.addEventListener('offline', () => {
  console.log('⚠ Offline mode');
  document.body.classList.remove('online');
  document.body.classList.add('offline');
});

// Set initial state
if (navigator.onLine) {
  document.body.classList.add('online');
} else {
  document.body.classList.add('offline');
}
