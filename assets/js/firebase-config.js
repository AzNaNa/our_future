/**
 * Firebase configuration for the whole site.
 *
 * ================= HOW TO CONNECT FIREBASE =================
 * 1) Open https://console.firebase.google.com and create a project.
 * 2) Go to Build -> Firestore Database -> Create database (start in test mode while building).
 * 3) In Project settings -> General -> "Your apps" create Web app and copy firebaseConfig.
 * 4) Paste config below.
 * 5) IMPORTANT for GitHub Pages: in Firestore rules, allow reads/writes for your use case.
 *    Example demo rule (unsafe for production):
 *    match /{document=**} { allow read, write: if true; }
 * 6) Collections you need:
 *    countries, dates, messages, memories, mood (optional), capsule (optional), settings (optional)
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'PASTE_YOUR_API_KEY',
  authDomain: 'PASTE_YOUR_AUTH_DOMAIN',
  projectId: 'PASTE_YOUR_PROJECT_ID',
  storageBucket: 'PASTE_YOUR_STORAGE_BUCKET',
  messagingSenderId: 'PASTE_YOUR_MESSAGING_SENDER_ID',
  appId: 'PASTE_YOUR_APP_ID'
};

let app;
let db;
let firebaseReady = false;

try {
  // If config is not filled, we keep app offline and show friendly hints on pages.
  if (firebaseConfig.projectId.startsWith('PASTE_')) {
    throw new Error('Firebase config not set');
  }
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  firebaseReady = true;
} catch (error) {
  console.warn('Firebase initialization skipped:', error.message);
}

export { db, firebaseReady };
