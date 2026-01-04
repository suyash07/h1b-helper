// copy your firebaseConfig from app.js (keeps it independent)
const firebaseConfig = {
  apiKey: "AIzaSyCnb1DgMpeKSDula4WkxCJ98sXp1luZHCU",
  authDomain: "h1bhelper-5c998.firebaseapp.com",
  databaseURL: "https://h1bhelper-5c998-default-rtdb.firebaseio.com",
  projectId: "h1bhelper-5c998",
  storageBucket: "h1bhelper-5c998.firebasestorage.app",
  messagingSenderId: "402102186934",
  appId: "1:402102186934:web:c0dbc73fc0aef924cb4717",
  measurementId: "G-XJSW3XMWQ2"
};

if (!firebase.apps || !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

const listEl = document.getElementById('listings');
const filterAll = document.getElementById('filterAll');
const filterOffer = document.getElementById('filterOffer');
const filterNeed = document.getElementById('filterNeed');

let allTrips = [];

function renderTrips(filter) {
  if (!allTrips.length) {
    listEl.innerHTML = '<p style="color:#666">No trips found.</p>';
    return;
  }

  const filtered = allTrips.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'offering') return t.role === 'offering-help';
    if (filter === 'need') return t.role === 'need-help';
  });

  if (!filtered.length) {
    listEl.innerHTML = '<p style="color:#666">No trips for this filter.</p>';
    return;
  }

  const html = filtered
    .sort((a,b) => b.timestamp.localeCompare(a.timestamp))
    .map(t => {
      return `
        <div style="padding:12px;border-radius:12px;border:1px solid #eee;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <strong>${t.origin} → ${t.destination}</strong>
            <span style="color:#666">${new Date(t.startDate).toLocaleString()}</span>
          </div>
          <div style="color:#333;margin-bottom:6px">${t.flightNumber ? 'Flight: ' + t.flightNumber : ''}</div>
          <div style="color:#444;margin-bottom:8px">${t.message || ''}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
            <div style="font-size:13px;color:#666">${t.languages ? t.languages.join(', ') : ''}</div>
            <div style="font-weight:600">${t.contactType}: ${t.contactValue}</div>
          </div>
        </div>
      `;
    }).join('');

  listEl.innerHTML = html;
}

function fetchTrips() {
  listEl.innerHTML = '<p style="color:#666">Loading…</p>';
  database.ref('trips').once('value').then(snapshot => {
    const data = snapshot.val() || {};
    allTrips = Object.keys(data).map(k => data[k]);
    renderTrips('all');
  }).catch(err => {
    listEl.innerHTML = '<p style="color:#c00">Error loading trips</p>';
    console.error(err);
  });
}

filterAll.addEventListener('click', () => renderTrips('all'));
filterOffer.addEventListener('click', () => renderTrips('offering'));
filterNeed.addEventListener('click', () => renderTrips('need'));

fetchTrips();
