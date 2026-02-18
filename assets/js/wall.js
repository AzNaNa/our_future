import {
  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { db, firebaseReady, renderFirebaseHint, renderRelationshipCounter } from './common.js';

const form = document.getElementById('messageForm');
const author = document.getElementById('author');
const text = document.getElementById('messageText');
const list = document.getElementById('messagesList');
const status = document.getElementById('formStatus');

await renderRelationshipCounter();

if (!firebaseReady) {
  renderFirebaseHint(list);
  form.querySelector('button').disabled = true;
} else {
  bindRealtimeMessages();
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = {
    name: author.value,
    text: text.value.trim(),
    timestamp: serverTimestamp()
  };
  if (!payload.text) return;

  try {
    await addDoc(collection(db, 'messages'), payload);
    text.value = '';
    status.textContent = 'Сообщение отправлено 💌';
  } catch (error) {
    status.textContent = 'Ошибка отправки сообщения.';
    status.classList.add('error');
  }
});

function bindRealtimeMessages() {
  const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
  onSnapshot(q, (snapshot) => {
    if (!snapshot.size) {
      list.innerHTML = '<p>Пока нет сообщений.</p>';
      return;
    }

    list.classList.remove('status');
    list.innerHTML = snapshot.docs.map((d) => {
      const item = d.data();
      const ts = item.timestamp?.toDate ? item.timestamp.toDate().toLocaleString() : 'сейчас';
      return `<article class="sticker">
        <strong>${item.name}</strong>
        <p>${item.text}</p>
        <small>${ts}</small>
        <div><button class="btn secondary" data-delete="${d.id}">Удалить</button></div>
      </article>`;
    }).join('');
  }, () => {
    list.textContent = 'Не удалось подключить realtime-ленту.';
    list.classList.add('error');
  });
}

list?.addEventListener('click', async (event) => {
  const btn = event.target.closest('[data-delete]');
  if (!btn) return;
  await deleteDoc(doc(db, 'messages', btn.dataset.delete));
});
