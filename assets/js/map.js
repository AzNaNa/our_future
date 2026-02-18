import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { db, firebaseReady, renderFirebaseHint, renderRelationshipCounter } from './common.js';

await renderRelationshipCounter();

const mapStatus = document.getElementById('mapStatus');
if (!firebaseReady) {
  renderFirebaseHint(mapStatus);
} else {
  loadMap();
}

async function loadMap() {
  const map = L.map('map').setView([48.85, 2.35], 3);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  try {
    const snapshot = await getDocs(collection(db, 'countries'));
    if (!snapshot.size) {
      mapStatus.textContent = 'Добавьте страны с полями lat/lng для отображения маркеров.';
      return;
    }

    snapshot.docs.forEach((d) => {
      const c = d.data();
      if (typeof c.lat !== 'number' || typeof c.lng !== 'number') return;
      L.marker([c.lat, c.lng]).addTo(map).bindPopup(`
        <strong>${c.name || 'Страна'}</strong><br>
        <img src="${c.coverImage || ''}" alt="${c.name || ''}" style="width:120px; margin-top:6px; border-radius:8px;">
      `);
    });
    mapStatus.textContent = 'Кликните на маркеры, чтобы увидеть фото.';
  } catch (error) {
    mapStatus.textContent = 'Ошибка загрузки карты.';
    mapStatus.classList.add('error');
  }
}
