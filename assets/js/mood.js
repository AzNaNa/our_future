import {
  addDoc, collection, getDocs, orderBy, query, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
import { db, firebaseReady, renderFirebaseHint, renderRelationshipCounter } from './common.js';

const form = document.getElementById('moodForm');
const scoreInput = document.getElementById('moodScore');
const status = document.getElementById('moodStatus');
const ctx = document.getElementById('moodChart');
let chart;

await renderRelationshipCounter();

if (!firebaseReady) {
  renderFirebaseHint(status);
  form.querySelector('button').disabled = true;
} else {
  await loadMood();
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const score = Number(scoreInput.value);
  if (!score || score < 1 || score > 5) return;

  try {
    await addDoc(collection(db, 'mood'), { score, timestamp: serverTimestamp() });
    status.textContent = 'Оценка настроения сохранена.';
    scoreInput.value = '';
    await loadMood();
  } catch (error) {
    status.textContent = 'Не удалось сохранить настроение.';
    status.classList.add('error');
  }
});

async function loadMood() {
  try {
    const q = query(collection(db, 'mood'), orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(q);
    const rows = snapshot.docs.map((d) => d.data()).filter((x) => x.timestamp?.toDate);
    const labels = rows.map((r) => r.timestamp.toDate().toLocaleDateString());
    const values = rows.map((r) => r.score);

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets: [{ label: 'Настроение', data: values, borderColor: '#b86b7e', backgroundColor: 'rgba(184,107,126,0.2)', tension: 0.3 }] },
      options: { scales: { y: { min: 1, max: 5, ticks: { stepSize: 1 } } } }
    });
  } catch (error) {
    status.textContent = 'Ошибка чтения коллекции mood.';
    status.classList.add('error');
  }
}
