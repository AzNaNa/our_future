import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { db, firebaseReady, renderFirebaseHint, renderRelationshipCounter } from './common.js';

const grid = document.getElementById('countriesGrid');
await renderRelationshipCounter();

if (!firebaseReady) {
  renderFirebaseHint(grid);
} else {
  loadCountries();
}

async function loadCountries() {
  try {
    const snapshot = await getDocs(collection(db, 'countries'));
    if (!snapshot.size) {
      grid.textContent = 'Стран пока нет. Добавьте документ в коллекцию countries.';
      return;
    }
    grid.classList.remove('status');
    grid.innerHTML = snapshot.docs.map((d) => {
      const c = d.data();
      return `<a class="card fade-in" href="country.html?id=${d.id}">
        <img src="${c.coverImage}" alt="${c.name}">
        <h3>${c.name || 'Без названия'}</h3>
        <p>${c.year || ''}</p>
      </a>`;
    }).join('');
  } catch (error) {
    grid.textContent = 'Ошибка загрузки стран.';
    grid.classList.add('error');
  }
}
