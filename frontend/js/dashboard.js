document.addEventListener('DOMContentLoaded', () => {
  fetchStudentCount();
});

async function fetchStudentCount() {
  const loading = document.getElementById('loading');
  const countDisplay = document.getElementById('total-students');

  try {
    const data = await window.fetchAPI('/students/count');
    countDisplay.textContent = data.count;
    loading.classList.add('hidden');
    countDisplay.classList.remove('hidden');
  } catch (error) {
    loading.classList.add('hidden');
    countDisplay.textContent = 'Error';
    countDisplay.classList.remove('hidden');
  }
}
