document.addEventListener('DOMContentLoaded', () => {
  fetchStudentsDropdown();
  fetchLogs();

  document.getElementById('btn-in').addEventListener('click', () => markStatus('IN'));
  document.getElementById('btn-out').addEventListener('click', () => markStatus('OUT'));
});

async function fetchStudentsDropdown() {
  const datalist = document.getElementById('studentList');
  try {
    const students = await window.fetchAPI('/students');
    datalist.innerHTML = '';
    
    window.studentMap = {};

    students.forEach(student => {
      const option = document.createElement('option');
      const text = `${student.name} (Room: ${student.roomNumber}) - Currently [${student.status}]`;
      option.value = text;
      datalist.appendChild(option);
      
      window.studentMap[text] = student._id;
    });
  } catch (error) {
    console.error('Error fetching students for datalist:', error);
  }
}

async function markStatus(actionType) {
  const inputValue = document.getElementById('studentSearch').value;
  const studentId = window.studentMap ? window.studentMap[inputValue] : null;

  if (!studentId) {
    window.showToast('Please select a valid student from the search list', 'error');
    return;
  }

  try {
    await window.fetchAPI('/logs', {
      method: 'POST',
      body: JSON.stringify({ studentId, actionType })
    });

    window.showToast(`Student marked as ${actionType}`);
    document.getElementById('studentSearch').value = '';
    fetchLogs();
    fetchStudentsDropdown();
  } catch (error) {

  }
}

async function fetchLogs() {
  const tbody = document.getElementById('logs-list');
  const loading = document.getElementById('loading');
  const emptyState = document.getElementById('empty-state');
  const table = document.getElementById('logs-table');

  loading.classList.remove('hidden');
  table.classList.add('hidden');
  emptyState.classList.add('hidden');

  try {
    const logs = await window.fetchAPI('/logs');

    loading.classList.add('hidden');

    if (logs.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }

    table.classList.remove('hidden');
    tbody.innerHTML = '';

    logs.forEach(log => {
      const tr = document.createElement('tr');

      const badgeClass = log.actionType === 'IN' ? 'badge-in' : 'badge-out';
      const date = new Date(log.timestamp);
      const timeString = date.toLocaleString();


      const studentName = log.student ? log.student.name : 'Unknown User';
      const roomNum = log.student ? log.student.roomNumber : '-';

      tr.innerHTML = `
        <td style="color: var(--text-secondary); font-size: 0.9rem;">${timeString}</td>
        <td style="font-weight: 500;">${studentName}</td>
        <td>${roomNum}</td>
        <td><span class="badge ${badgeClass}">${log.actionType}</span></td>
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    loading.classList.add('hidden');
  }
}
