import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for offline support (works in both dev and prod)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('✓ Service Worker registered:', registration.scope);
        
        // Check for updates every minute
        setInterval(() => {
          registration.update();
        }, 60000);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('✓ New Service Worker available - will update on next reload');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('✗ Service Worker registration failed:', error);
      });
  });

  // Handle service worker updates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('✓ Service Worker updated');
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
