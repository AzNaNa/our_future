import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { db, firebaseReady, daysBetween, renderFirebaseHint, renderRelationshipCounter } from './common.js';

// Массив романтичных цитат
const loveQuotes = [
  { text: "Каждый день с тобой — особенный, даже если он просто в телемосте)", author: "Азна" },
  { text: "Счастье — это делать тебе массаж ножек слушая мияги))", author: "Азна" },
  { text: "Ты делаешь мою жизнь ярче, и гораздо вкуснее", author: "Азна" },
  { text: "Любовь — это слушать каждую твою историю в твоей эмоциональной подаче", author: "Азна" },
  { text: "Hey, you)", author: "Азна" },
  { text: "Ты — моя самая самая вкусная киса", author: "Азна" },
  { text: "Каждый день с тобой, самый лучший", author: "Азна" },
  { text: "Я люблю тебя, даже когда ты вредная змеючка", author: "Азна" },
  { text: "Тебя достаточно)", author: "Азна" },
  { text: "Наша история только начинается", author: "Азна" }
];

function pluralDays(number) {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'дней';
  if (lastDigit === 1) return 'день';
  if (lastDigit >= 2 && lastDigit <= 4) return 'дня';
  return 'дней';
}

// DOM элементы
const memoryContainer = document.getElementById('memoryContainer');
const randomMemoryBtn = document.getElementById('randomMemoryBtn');
const eventsContainer = document.getElementById('eventsContainer');
const prevEventBtn = document.getElementById('prevEventBtn');
const nextEventBtn = document.getElementById('nextEventBtn');
const eventCounter = document.getElementById('eventCounter');
let memories = [];
let allEvents = [];
let currentEventIndex = 0;

// ===== ФУНКЦИИ ДЛЯ ВОСПОМИНАНИЙ =====
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

// ===== ФУНКЦИИ ДЛЯ КАРУСЕЛИ СОБЫТИЙ =====
async function loadEvents() {
  try {
    const snapshot = await getDocs(collection(db, 'dates'));
    allEvents = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (!allEvents.length) {
      eventsContainer.innerHTML = '<div class="no-events">Добавьте события в коллекцию dates</div>';
      if (prevEventBtn) prevEventBtn.disabled = true;
      if (nextEventBtn) nextEventBtn.disabled = true;
      return;
    }

    // Сортируем все события по дате (от старых к новым)
    allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Находим индекс ближайшего будущего события для старта
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    currentEventIndex = allEvents.findIndex(event => {
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= now;
    });

    // Если нет будущих событий, показываем последнее
    if (currentEventIndex === -1) {
      currentEventIndex = allEvents.length - 1;
    }

    // Обновляем кнопки и показываем событие
    updateCarouselButtons();
    displayEvent(currentEventIndex);

  } catch (error) {
    console.error('Ошибка загрузки событий:', error);
    eventsContainer.innerHTML = '<div class="error">Не удалось загрузить события</div>';
  }
}

function displayEvent(index) {
  if (!allEvents.length || index < 0 || index >= allEvents.length) return;

  const event = allEvents[index];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const eventDate = new Date(event.date);
  eventDate.setHours(0, 0, 0, 0);

  const delta = daysBetween(now, eventDate);
  const absDelta = Math.abs(delta);
  const word = pluralDays(absDelta);

  // Прогресс-бар
  let progress = 0;
  let progressText = '';

  if (delta > 0) {
    const daysTotal = 365;
    progress = Math.min(100, Math.round((daysTotal - delta) / daysTotal * 100));
    progressText = `${progress}% до события`;
  } else if (delta < 0) {
    progress = 100;
    progressText = `Прошло ${absDelta} ${word}`;
  } else {
    progress = 100;
    progressText = 'Событие сегодня! ✨';
  }

  const label = delta > 0 ? `через ${delta} ${word}` :
    delta < 0 ? `${absDelta} ${word} назад` :
      'сегодня!';

  const randomQuote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];

  // Форматируем дату
  const formattedDate = eventDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Анимация
  eventsContainer.classList.add('fade-out');

  setTimeout(() => {
    eventsContainer.innerHTML = `
      <div class="event-card">
        <h3 class="event-title">${event.title}</h3>
        <div class="event-date-badge">
          <i class="fa-regular fa-calendar"></i> ${formattedDate}
        </div>
        
        <div class="event-countdown">
          <span style="color: var(--accent); font-weight: bold;">${label}</span>
        </div>
        
        <div class="event-progress">
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="progress-label">
              <i class="fa-regular fa-clock"></i> ${progressText}
            </div>
          </div>
        </div>
        
        <div class="event-quote">
          <i class="fa-regular fa-heart"></i> ${randomQuote.text}
          <div class="quote-author">— ${randomQuote.author}</div>
        </div>
      </div>
    `;

    eventsContainer.classList.remove('fade-out');
  }, 200);

  // Обновляем счетчик
  if (eventCounter) {
    eventCounter.textContent = `${index + 1} из ${allEvents.length}`;
  }
  updateCarouselButtons();
}

function updateCarouselButtons() {
  if (prevEventBtn) prevEventBtn.disabled = currentEventIndex <= 0;
  if (nextEventBtn) nextEventBtn.disabled = currentEventIndex >= allEvents.length - 1;
}

// ===== ЗАПУСК =====
await renderRelationshipCounter();

if (!firebaseReady) {
  renderFirebaseHint(memoryContainer);
  renderFirebaseHint(eventsContainer);
  if (randomMemoryBtn) randomMemoryBtn.disabled = true;
  if (prevEventBtn) prevEventBtn.disabled = true;
  if (nextEventBtn) nextEventBtn.disabled = true;
} else {
  await Promise.all([loadMemories(), loadEvents()]);
}

// Обработчики
randomMemoryBtn?.addEventListener('click', showRandomMemory);
prevEventBtn?.addEventListener('click', () => {
  if (currentEventIndex > 0) {
    currentEventIndex--;
    displayEvent(currentEventIndex);
  }
});
nextEventBtn?.addEventListener('click', () => {
  if (currentEventIndex < allEvents.length - 1) {
    currentEventIndex++;
    displayEvent(currentEventIndex);
  }
});