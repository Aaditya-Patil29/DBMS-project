document.addEventListener('DOMContentLoaded', () => {
  fetchStudentsDropdown();
  fetchLogs();

  document.getElementById('btn-in').addEventListener('click', () => markStatus('IN'));
  document.getElementById('btn-out').addEventListener('click', () => markStatus('OUT'));
});

async function fetchStudentsDropdown() {
  const select = document.getElementById('studentSelect');
  try {
    const students = await window.fetchAPI('/students');
    select.innerHTML = '<option value="" disabled selected>-- Choose a student --</option>';
    
    students.forEach(student => {
      const option = document.createElement('option');
      option.value = student._id;
      // Show if they are CURRENTLY IN or OUT to help user decide
      option.textContent = `${student.name} (Room: ${student.roomNumber}) - Currently [${student.status}]`;
      select.appendChild(option);
    });
  } catch (error) {
    select.innerHTML = '<option value="" disabled>Error loading students</option>';
  }
}

async function markStatus(actionType) {
  const studentId = document.getElementById('studentSelect').value;
  
  if (!studentId) {
    window.showToast('Please select a student first', 'error');
    return;
  }

  try {
    await window.fetchAPI('/logs', {
      method: 'POST',
      body: JSON.stringify({ studentId, actionType })
    });
    
    window.showToast(`Student marked as ${actionType}`);
    fetchLogs(); // refresh logs
    fetchStudentsDropdown(); // refresh dropdown statuses
  } catch (error) {
    // Error toast handled by fetchAPI
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
      
      // Safety check in case student was deleted but log remains
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
