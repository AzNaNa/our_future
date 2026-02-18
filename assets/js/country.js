import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { db, firebaseReady, renderFirebaseHint, renderRelationshipCounter } from './common.js';

const titleEl = document.getElementById('countryTitle');
const storyEl = document.getElementById('countryStory');
const galleryEl = document.getElementById('countryGallery');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');

await renderRelationshipCounter();

if (!firebaseReady) {
  renderFirebaseHint(storyEl);
} else {
  loadCountry();
}

async function loadCountry() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) {
    titleEl.textContent = 'Страна не указана';
    return;
  }

  try {
    const snap = await getDoc(doc(db, 'countries', id));
    if (!snap.exists()) {
      titleEl.textContent = 'Страна не найдена';
      return;
    }
    const c = snap.data();
    titleEl.textContent = `${c.name || 'Страна'} (${c.year || 'год?'})`;
    storyEl.textContent = c.story || 'Добавьте поле story в документ страны.';

    const photos = Array.isArray(c.images) ? c.images : [];
    galleryEl.innerHTML = photos.map((src, index) => `
      <figure class="polaroid" style="--rot:${index % 2 === 0 ? '-2deg' : '2deg'}">
        <img src="${src}" alt="${c.name} ${index + 1}" data-full="${src}">
      </figure>
    `).join('');

    galleryEl.addEventListener('click', (event) => {
      const img = event.target.closest('img');
      if (!img) return;
      lightboxImage.src = img.dataset.full;
      lightbox.classList.add('open');
    });
  } catch (error) {
    storyEl.textContent = 'Ошибка загрузки страны.';
    storyEl.classList.add('error');
  }
}

lightbox?.addEventListener('click', () => lightbox.classList.remove('open'));
