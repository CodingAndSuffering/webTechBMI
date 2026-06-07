const editForm = document.getElementById('editForm');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const genderInput = document.getElementById('gender');
const activityLevelInput = document.getElementById('activityLevel');
const bmiDisplay = document.getElementById('bmiDisplay');

const queryParams = new URLSearchParams(window.location.search);
const userId = queryParams.get('id');

function updateBmiDisplay() {
  const height = Number(heightInput.value);
  const weight = Number(weightInput.value);
  const bmi = height > 0 && weight > 0 ? (weight / Math.pow(height / 100, 2)).toFixed(1) : 'Enter height and weight to calculate BMI';
  bmiDisplay.textContent = bmi;
}

async function loadUser() {
  if (!userId) {
    alert('User id is missing.');
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) throw new Error('Unable to load user');

    const user = await response.json();
    nameInput.value = user.name || '';
    ageInput.value = user.age || '';
    heightInput.value = user.height || '';
    weightInput.value = user.weight || '';
    genderInput.value = user.gender || '';
    activityLevelInput.value = user.activityLevel || '';
    updateBmiDisplay();
  } catch (error) {
    console.error(error);
    alert('Could not load user.');
    window.location.href = 'index.html';
  }
}

editForm.addEventListener('submit', async event => {
  event.preventDefault();

  const updatedUser = {
    id: Number(userId),
    name: nameInput.value.trim(),
    age: Number(ageInput.value),
    height: Number(heightInput.value),
    weight: Number(weightInput.value),
    gender: genderInput.value,
    activityLevel: activityLevelInput.value
  };

  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Unable to update user');
    }

    window.location.href = 'index.html';
  } catch (error) {
    console.error(error);
    alert('Could not update user. Please try again.');
  }
});

heightInput.addEventListener('input', updateBmiDisplay);
weightInput.addEventListener('input', updateBmiDisplay);
window.addEventListener('DOMContentLoaded', loadUser);
