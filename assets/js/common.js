import { db, firebaseReady } from './firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

export const RELATIONSHIP_START_FALLBACK = '2022-02-14';

export async function renderRelationshipCounter() {
  const counter = document.getElementById('relationshipCounter');
  if (!counter) return;

  let startDate = RELATIONSHIP_START_FALLBACK;

  if (firebaseReady) {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'relationship'));
      if (settingsDoc.exists() && settingsDoc.data().startDate) {
        startDate = settingsDoc.data().startDate;
      }
    } catch (error) {
      console.warn('settings read failed', error);
    }
  }

  const diffMs = Date.now() - new Date(startDate).getTime();
  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  // Функция склонения
  function pluralDays(number) {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'дней';
    if (lastDigit === 1) return 'день';
    if (lastDigit >= 2 && lastDigit <= 4) return 'дня';
    return 'дней';
  }

  const word = pluralDays(days);
  counter.textContent = `Мы вместе уже ${days} ${word}`;
}

export function renderFirebaseHint(el) {
  if (!el) return;
  el.innerHTML = '⚠️ Firebase пока не настроен. Откройте <code>assets/js/firebase-config.js</code> и вставьте ваш конфиг.';
  el.classList.add('error');
}

export function daysBetween(dateA, dateB = new Date()) {
  const start = new Date(dateA);
  const end = new Date(dateB);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.floor((end - start) / 86400000);
}

export { db, firebaseReady };
