import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Debug: Log config to verify environment variables are loaded
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? '✓ Loaded' : '✗ Missing',
  authDomain: firebaseConfig.authDomain ? '✓ Loaded' : '✗ Missing',
  projectId: firebaseConfig.projectId ? '✓ Loaded' : '✗ Missing',
  storageBucket: firebaseConfig.storageBucket ? '✓ Loaded' : '✗ Missing',
  messagingSenderId: firebaseConfig.messagingSenderId ? '✓ Loaded' : '✗ Missing',
  appId: firebaseConfig.appId ? '✓ Loaded' : '✗ Missing'
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence for Firestore with multi-tab support
// Try multi-tab first, fallback to single-tab if needed
enableMultiTabIndexedDbPersistence(db)
  .then(() => {
    console.log('✓ Firebase offline persistence enabled (multi-tab)');
  })
  .catch((err) => {
    if (err.code === 'unimplemented') {
      // Multi-tab not supported, try single-tab
      console.log('Multi-tab persistence not supported, trying single-tab...');
      return enableIndexedDbPersistence(db)
        .then(() => {
          console.log('✓ Firebase offline persistence enabled (single-tab)');
        })
        .catch((singleTabErr) => {
          if (singleTabErr.code === 'failed-precondition') {
            console.warn('⚠ Offline persistence failed: Multiple tabs open. Close other tabs and refresh.');
          } else if (singleTabErr.code === 'unimplemented') {
            console.warn('⚠ Offline persistence not supported by this browser');
          } else {
            console.error('✗ Error enabling offline persistence:', singleTabErr);
          }
        });
    } else {
      console.error('✗ Error enabling multi-tab persistence:', err);
    }
  });

// Monitor online/offline status for Firebase
window.addEventListener('online', () => {
  console.log('✓ Network online - Firebase will sync pending changes');
});

window.addEventListener('offline', () => {
  console.log('⚠ Network offline - Firebase using cached data');
});

export default app;