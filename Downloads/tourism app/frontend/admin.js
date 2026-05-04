// Simple admin UI script to manage divisions and spots
const apiBase = 'http://localhost:3001/api';

function getToken() {
  try {
    const s = JSON.parse(localStorage.getItem('tourismSession') || 'null');
    return s?.token || null;
  } catch (e) {
    return null;
  }
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
}

async function loadAdminData() {
  const listNode = document.getElementById('divisionsList');
  const messageNode = document.getElementById('adminMessage');
  messageNode.textContent = 'Loading...';

  try {
    const res = await fetch(`${apiBase}/admin/destinations`, { headers: authHeaders() });
    if (!res.ok) throw new Error('Failed to load');
    const payload = await res.json();
    const divisions = payload.data || [];
    renderDivisions(divisions);
    messageNode.textContent = '';
  } catch (err) {
    console.error('loadAdminData error', err);
    messageNode.textContent = 'Could not load divisions. Check you are logged in as admin.';
  }
}

function renderDivisions(divisions) {
  const listNode = document.getElementById('divisionsList');
  if (!listNode) return;
  if (!divisions.length) {
    listNode.innerHTML = '<div class="empty-state">No divisions found</div>';
    return;
  }

  listNode.innerHTML = divisions.map((d) => {
    const spotsHtml = (d.spots || []).map((s, i) => `
      <li>
        ${s.spot_name || '(no name)'} — ${s.cost || ''}
        <button data-division="${d.id}" data-spot-index="${i}" class="btn small delete-spot">Delete spot</button>
      </li>`).join('');

    return `
      <section class="admin-division">
        <h3>${d.name} <small>(${d.id})</small></h3>
        <button data-division="${d.id}" class="btn delete-division">Delete division</button>
        <h4>Spots</h4>
        <ul>${spotsHtml}</ul>
        <form data-division="${d.id}" class="add-spot-form">
          <input name="spot_name" placeholder="Spot name" required>
          <input name="cost" placeholder="Cost (e.g. 500 BDT)">
          <input name="hotel" placeholder="Hotel">
          <input name="map_url" placeholder="Map URL">
          <button type="submit" class="btn">Add spot</button>
        </form>
      </section>
    `;
  }).join('');

  // Attach event listeners
  document.querySelectorAll('.delete-division').forEach((btn) => {
    btn.addEventListener('click', handleDeleteDivision);
  });

  document.querySelectorAll('.delete-spot').forEach((btn) => {
    btn.addEventListener('click', handleDeleteSpot);
  });

  document.querySelectorAll('.add-spot-form').forEach((form) => {
    form.addEventListener('submit', handleAddSpot);
  });
}

async function handleDeleteDivision(e) {
  const id = e.currentTarget.dataset.division;
  if (!confirm(`Delete division "${id}"? This cannot be undone.`)) return;
  try {
    const res = await fetch(`${apiBase}/admin/destinations/${encodeURIComponent(id)}`, { method: 'DELETE', headers: authHeaders() });
    if (!res.ok) throw new Error('Delete failed');
    await loadAdminData();
  } catch (err) {
    alert('Could not delete division');
    console.error(err);
  }
}

async function handleDeleteSpot(e) {
  const id = e.currentTarget.dataset.division;
  const index = e.currentTarget.dataset.spotIndex;
  if (!confirm('Delete this spot?')) return;
  try {
    const res = await fetch(`${apiBase}/admin/destinations/${encodeURIComponent(id)}/spots/${index}`, { method: 'DELETE', headers: authHeaders() });
    if (!res.ok) throw new Error('Delete spot failed');
    await loadAdminData();
  } catch (err) {
    alert('Could not delete spot');
    console.error(err);
  }
}

async function handleAddSpot(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const division = form.dataset.division;
  const fd = new FormData(form);
  const payload = Object.fromEntries(fd.entries());
  try {
    const res = await fetch(`${apiBase}/admin/destinations/${encodeURIComponent(division)}/spots`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
    if (!res.ok) throw new Error('Add spot failed');
    form.reset();
    await loadAdminData();
  } catch (err) {
    alert('Could not add spot');
    console.error(err);
  }
}

// Division creation form
async function handleCreateDivision(e) {
  e.preventDefault();
  const f = e.currentTarget;
  const fd = new FormData(f);
  const payload = { id: String(fd.get('id') || '').trim(), name: String(fd.get('name') || '').trim() };
  if (!payload.id || !payload.name) {
    alert('Please fill id and name');
    return;
  }

  try {
    const res = await fetch(`${apiBase}/admin/destinations`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
    if (!res.ok) {
      const data = await res.json().catch(()=>({}));
      throw new Error(data.message || 'Create failed');
    }
    f.reset();
    await loadAdminData();
  } catch (err) {
    alert('Could not create division: ' + err.message);
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const createForm = document.getElementById('createDivisionForm');
  if (createForm) createForm.addEventListener('submit', handleCreateDivision);
  loadAdminData();
});
