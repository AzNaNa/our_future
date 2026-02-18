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
  apiKey: "AIzaSyDN6uLWDyZWiy6hZul4tYH8jUWO6Hb1yAI",
  authDomain: "our-future-ef56a.firebaseapp.com",
  projectId: "our-future-ef56a",
  storageBucket: "our-future-ef56a.firebasestorage.app",
  messagingSenderId: "99356391127",
  appId: "1:99356391127:web:6fe72f2421ad63c5716292",
  measurementId: "G-VQQRDH9186"
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
