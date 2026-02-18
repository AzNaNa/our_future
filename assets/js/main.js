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

// Массив романтичных цитат (можно добавить свои)
const loveQuotes = [
  { text: "Каждый день с тобой — особенный, даже если он просто в телемосте)", author: "Соня" },
  { text: "Счастье — это делать тебе массаж ножек слушая мияги))", author: "Азна" },
  { text: "Ты делаешь мою жизнь ярче, и гораздо вкуснее", author: "Соня" },
  { text: "Любовь — это слушать каждую твою историю в твоей эмоциональной подаче", author: "Азна" },
  { text: "Hey, you)", author: "Соня" },
  { text: "Ты — моя самая самая вкусная киса", author: "Азна" },
  { text: "Каждый день с тобой, самый лучший", author: "Соня" },
  { text: "Я люблю тебя, даже когда ты вредная змеючка", author: "Азна" },
  { text: "Тебя достаточно)", author: "Соня" },
  { text: "Наша история только начинается", author: "Азна" }
];

async function loadNextEvent() {
  try {
    const snapshot = await getDocs(collection(db, 'dates'));
    const dates = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (!dates.length) {
      nextEventContainer.textContent = 'Добавьте документы в коллекцию dates.';
      return;
    }

    const now = new Date();
    // Обнуляем время для корректного сравнения
    now.setHours(0, 0, 0, 0);

    const future = dates
      .filter((item) => {
        const itemDate = new Date(item.date);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate >= now;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const chosen = future[0] || dates.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    // Вычисляем дни до/после события
    const eventDate = new Date(chosen.date);
    eventDate.setHours(0, 0, 0, 0);
    const delta = daysBetween(now, eventDate); // положительное если событие в будущем

    const absDelta = Math.abs(delta);
    const word = pluralDays(absDelta);

    // Для прогресс-бара: используем 365 дней как полный цикл
    let progress = 0;
    let progressText = '';

    if (delta > 0) {
      // Будущее событие
      const daysTotal = 365;
      progress = Math.min(100, Math.round((daysTotal - delta) / daysTotal * 100));
      progressText = `${progress}% до события`;
    } else if (delta < 0) {
      // Прошедшее событие
      progress = 100;
      progressText = `Событие прошло ${absDelta} ${word} назад`;
    } else {
      // Сегодня
      progress = 100;
      progressText = 'Событие сегодня! ✨';
    }

    const label = delta > 0 ? `через ${delta} ${word}` :
      delta < 0 ? `${absDelta} ${word} назад` :
        'сегодня!';

    // Выбираем случайную цитату
    const randomQuote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];

    nextEventContainer.innerHTML = `
      <div class="event-stats">
        <h3>${chosen.title}</h3>
        <p style="font-size: 1.2rem; color: var(--accent); font-weight: bold;">${label}</p>
        
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progress}%"></div>
          </div>
          <div class="progress-label">
            <i class="fa-regular fa-clock"></i> ${progressText}
          </div>
        </div>
        
        <div class="event-quote">
          <i class="fa-regular fa-heart"></i> ${randomQuote.text}
          <div class="quote-author">— ${randomQuote.author}</div>
        </div>
        
        ${delta > 0 ? `
          <p style="font-size: 0.9rem; margin-top: 0.8rem; opacity: 0.8;">
            <i class="fa-regular fa-calendar-check"></i> 
            ${eventDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        ` : ''}
      </div>
    `;
  } catch (error) {
    console.error('Ошибка загрузки событий:', error);
    nextEventContainer.textContent = 'Не удалось загрузить события.';
    nextEventContainer.classList.add('error');
  }
}
