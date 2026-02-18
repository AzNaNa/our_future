import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { db, firebaseReady, daysBetween, renderFirebaseHint, renderRelationshipCounter } from './common.js';

const list = document.getElementById('datesList');
await renderRelationshipCounter();

if (!firebaseReady) {
  renderFirebaseHint(list);
} else {
  loadDates();
}

async function loadDates() {
  try {
    const snapshot = await getDocs(collection(db, 'dates'));
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (!items.length) {
      list.textContent = 'Коллекция dates пуста.';
      return;
    }

    list.classList.remove('status');
    list.innerHTML = items.map((item) => {
      const diff = daysBetween(item.date);
      const desc = diff >= 0
        ? `${Math.floor(diff / 365)} г. назад (прошло ${diff} дней)`
        : `через ${Math.abs(diff)} дней`;
      return `<article class="card"><h3>${item.title}</h3><p>${item.date}</p><p>${desc}</p></article>`;
    }).join('');
  } catch (error) {
    list.textContent = 'Не удалось получить даты.';
    list.classList.add('error');
  }
}
