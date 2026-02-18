import { renderRelationshipCounter } from './common.js';

await renderRelationshipCounter();

const PASSWORD = '2022-02-14'; // Можно изменить на вашу дату знакомства.

const form = document.getElementById('capsuleForm');
const passwordInput = document.getElementById('capsulePassword');
const status = document.getElementById('capsuleStatus');
const content = document.getElementById('capsuleContent');

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (passwordInput.value === PASSWORD) {
    status.textContent = 'Доступ открыт ✨';
    content.hidden = false;
  } else {
    status.textContent = 'Неверный пароль.';
    status.classList.add('error');
  }
});
