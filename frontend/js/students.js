document.addEventListener('DOMContentLoaded', () => {
  fetchStudents();

  const addForm = document.getElementById('add-student-form');
  addForm.addEventListener('submit', handleAddStudent);
});

async function fetchStudents() {
  const tbody = document.getElementById('students-list');
  const loading = document.getElementById('loading');
  const emptyState = document.getElementById('empty-state');
  const table = document.getElementById('students-table');

  loading.classList.remove('hidden');
  table.classList.add('hidden');
  emptyState.classList.add('hidden');

  try {
    const students = await window.fetchAPI('/students');

    loading.classList.add('hidden');

    if (students.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }

    table.classList.remove('hidden');
    tbody.innerHTML = '';

    students.forEach(student => {
      const tr = document.createElement('tr');

      const feeBadgeClass = student.feesStatus === 'Paid' ? 'badge-paid' : 'badge-unpaid';
      const statusBadgeClass = student.status === 'IN' ? 'badge-in' : 'badge-out';

      tr.innerHTML = `
        <td>
          <div style="font-weight: 500;">${student.name}</div>
          <div style="font-size: 0.8rem; color: var(--text-secondary);">${student.email}</div>
        </td>
        <td>${student.roomNumber}</td>
        <td><span class="badge ${feeBadgeClass}">${student.feesStatus}</span></td>
        <td><span class="badge ${statusBadgeClass}">${student.status}</span></td>
        <td>
          <button class="action-btn del" onclick="deleteStudent('${student._id}')" title="Delete">
            <span class="material-symbols-outlined" style="font-size: 1.2rem;">delete</span>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    loading.classList.add('hidden');
  }
}

async function handleAddStudent(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const roomNumber = document.getElementById('roomNumber').value;
  const feesStatus = document.getElementById('feesStatus').value;

  try {
    await window.fetchAPI('/students', {
      method: 'POST',
      body: JSON.stringify({ name, email, roomNumber, feesStatus }),
    });

    window.showToast('Student added successfully!');
    document.getElementById('add-student-form').reset();
    fetchStudents();

  } catch (error) {

  }
}

async function deleteStudent(id) {
  if (confirm('Are you sure you want to remove this student?')) {
    try {
      await window.fetchAPI(`/students/${id}`, {
        method: 'DELETE',
      });
      window.showToast('Student removed via system.');
      fetchStudents();
    } catch (error) {

    }
  }
}
