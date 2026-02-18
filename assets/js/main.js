import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { db, firebaseReady, daysBetween, renderFirebaseHint, renderRelationshipCounter } from './common.js';

function pluralDays(number) {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'дней';
  if (lastDigit === 1) return 'день';
  if (lastDigit >= 2 && lastDigit <= 4) return 'дня';
  return 'дней';
}

const memoryContainer = document.getElementById('memoryContainer');
const randomMemoryBtn = document.getElementById('randomMemoryBtn');
const nextEventContainer = document.getElementById('nextEventContainer');
let memories = [];

await renderRelationshipCounter();

if (!firebaseReady) {
  renderFirebaseHint(memoryContainer);
  renderFirebaseHint(nextEventContainer);
  randomMemoryBtn.disabled = true;
} else {
  await Promise.all([loadMemories(), loadNextEvent()]);
}

randomMemoryBtn?.addEventListener('click', () => showRandomMemory());

async function loadMemories() {
  try {
    const snapshot = await getDocs(collection(db, 'memories'));
    memories = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (!memories.length) {
      memoryContainer.textContent = 'Пока нет воспоминаний в Firestore.';
      return;
    }
    showRandomMemory();
  } catch (error) {
    memoryContainer.textContent = 'Не удалось загрузить воспоминания. Проверьте Firestore rules.';
    memoryContainer.classList.add('error');
  }
}

function showRandomMemory() {
  if (!memories.length) return;
  const random = memories[Math.floor(Math.random() * memories.length)];
  memoryContainer.innerHTML = `<img src="${random.photo}" alt="Воспоминание"><p>${random.text || ''}</p>`;
}

async function loadNextEvent() {
  try {
    const snapshot = await getDocs(collection(db, 'dates'));
    const dates = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (!dates.length) {
      nextEventContainer.textContent = 'Добавьте документы в коллекцию dates.';
      return;
    }

    const now = new Date();
    const future = dates
      .filter((item) => new Date(item.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const chosen = future[0] || dates.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    const delta = daysBetween(chosen.date, now) * -1;
    const word = pluralDays(Math.abs(delta));
    const label = delta >= 0 ? `через ${delta} ${word}` : `${Math.abs(delta)} ${word} назад`;
    nextEventContainer.innerHTML = `<h3>${chosen.title}</h3><p>${label}</p>`;
  } catch (error) {
    nextEventContainer.textContent = 'Не удалось загрузить события.';
    nextEventContainer.classList.add('error');
  }
}
