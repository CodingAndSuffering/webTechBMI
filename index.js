const userTableBody = document.getElementById('userTableBody');
const searchInput = document.getElementById('searchInput');
let usersCache = [];

async function loadUsers(searchTerm = '') {
  try {
    const response = await fetch('/api/users' + (searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''));
    if (!response.ok) throw new Error('Unable to load users');

    usersCache = await response.json();
    renderUsers(usersCache);
  } catch (error) {
    console.error(error);
    // Provide actionable message and a retry button when the API is not reachable.
    const origin = (window.location.origin && window.location.origin !== 'null') ? window.location.origin : '';
    userTableBody.innerHTML = `
      <tr><td colspan="9">
        <div class="alert alert-danger">Failed to load users from the API.</div>
        <div>
          <a href="${origin || '/'}" class="btn btn-sm btn-secondary me-2">Open app root</a>
          <button id="retryLoad" class="btn btn-sm btn-primary">Retry</button>
          <span class="ms-2 text-muted">Ensure you started the server (dotnet run) and opened the page via the server URL.</span>
        </div>
      </td></tr>`;

    // Attach retry handler
    setTimeout(() => {
      const btn = document.getElementById('retryLoad');
      if (btn) btn.addEventListener('click', () => loadUsers(searchInput.value.trim()));
    }, 50);
  }
}

function renderUsers(users) {
  if (!users.length) {
    userTableBody.innerHTML = '<tr><td colspan="9">No users found.</td></tr>';
    return;
  }

  userTableBody.innerHTML = users.map(user => {
    const bmi = calculateBMI(user);
    const status = calculateStatus(bmi);
    const calories = calculateCalories(user);

    return `
      <tr>
        <td><img src="${user.image || 'https://via.placeholder.com/80'}" alt="Meme" width="80" /></td>
        <td>${escapeHtml(user.name)}</td>
        <td>${user.age}</td>
        <td>${user.height}</td>
        <td>${user.weight}</td>
        <td>${bmi}</td>
        <td class="${status.class}">${status.label}</td>
        <td>${calories}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="window.location.href='edit-user.html?id=${user.id}'">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">Delete</button>
        </td>
      </tr>`;
  }).join('');
}

function calculateBMI(user) {
  if (!user.height || !user.weight) return '0.0';
  const bmi = user.weight / Math.pow(user.height / 100, 2);
  return bmi.toFixed(1);
}

function calculateStatus(bmi) {
  const numericBmi = Number(bmi);
  if (numericBmi < 18.5) return { label: 'Underweight', class: 'status-underweight' };
  if (numericBmi < 25) return { label: 'Normal', class: 'status-normal' };
  if (numericBmi < 30) return { label: 'Overweight', class: 'status-overweight' };
  return { label: 'Obese', class: 'status-obese' };
}

function calculateCalories(user) {
  if (!user.gender || !user.activityLevel || !user.age || !user.height || !user.weight) return '-';

  const gender = user.gender.toLowerCase();
  const activity = user.activityLevel.toLowerCase();
  const bmr = gender === 'male'
    ? 10 * user.weight + 6.25 * user.height - 5 * user.age + 5
    : 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;

  const multiplier = activity === 'high' ? 1.9 : activity === 'moderate' ? 1.55 : 1.2;
  const maintenance = Math.round(bmr * multiplier);
  const loss = maintenance - 500;
  const gain = maintenance + 500;

  return `Maintain: ${maintenance}, Lose: ${loss}, Gain: ${gain}`;
}

async function deleteUser(id) {
  if (!window.confirm('Delete this user?')) return;

  const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
  if (response.ok) {
    loadUsers(searchInput.value.trim());
  } else {
    alert('Could not delete user.');
  }
}

function escapeHtml(value) {
  if (!value) return '';
  return value.replace(/[&<>"]+/g, match => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[match]));
}

function filterUsers() {
  const term = searchInput.value.trim();
  loadUsers(term);
}

searchInput.addEventListener('input', filterUsers);
window.addEventListener('DOMContentLoaded', () => loadUsers());
