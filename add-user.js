window.addEventListener('DOMContentLoaded', () => {
  const addUserForm = document.getElementById('addUserForm');
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const closeModal = document.getElementById('closeModal');
  const backButton = document.getElementById('backButton');

  if (closeModal && imageModal) {
    closeModal.addEventListener('click', () => {
      imageModal.style.display = 'none';
    });
  }

  if (backButton) {
    backButton.addEventListener('click', () => {
      const target = (window.location.origin && window.location.origin !== 'null') ? `${window.location.origin}/index.html` : '/index.html';
      window.location.href = target;
    });
  }

  if (addUserForm) {
    addUserForm.addEventListener('submit', async event => {
  event.preventDefault();

  const user = {
    name: document.getElementById('inputName').value.trim(),
    age: Number(document.getElementById('inputAge').value),
    height: Number(document.getElementById('inputHeight').value),
    weight: Number(document.getElementById('inputWeight').value),
    gender: document.getElementById('inputGender').value,
    activityLevel: document.getElementById('inputActivity').value
  };

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Unable to save user');
    }

    const savedUser = await response.json();
    // Redirect back to the index page after saving — prefer absolute origin so served pages return to the API host.
    const target = (window.location.origin && window.location.origin !== 'null') ? `${window.location.origin}/index.html` : '/index.html';
    window.location.href = target;
  } catch (error) {
    console.error(error);
    alert('Could not save user. Please check all fields and try again.');
  }
});
  }
});
