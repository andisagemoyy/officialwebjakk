'use strict';
const icons = {
  document: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 12h8M8 16h6"/>',
  clipboard: '<rect x="5" y="4" width="14" height="18" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="m8 12 2 2 5-5M8 18h8"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  train: '<rect x="5" y="3" width="14" height="16" rx="4"/><path d="M5 10h14M12 3v7M8 22l2-3M16 22l-2-3M8 15h1M15 15h1"/>',
  ticket: '<path d="M3 7h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4zM15 7v2m0 3v2m0 3v2"/>'
};
const grid = document.getElementById('app-grid');
document.getElementById('app-count').textContent = String((window.JAKK_APPS || []).length).padStart(2, '0');
for (const [index, app] of (window.JAKK_APPS || []).entries()) {
  const card = document.createElement('article');
  card.className = 'app-card';
  const top = document.createElement('div'); top.className = 'card-top';
  const icon = document.createElement('div'); icon.className = 'app-icon';
  icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (icons[app.icon] || icons.document) + '</svg>';
  const number = document.createElement('span'); number.className = 'card-number'; number.textContent = String(index + 1).padStart(2, '0');
  top.append(icon, number);
  const title = document.createElement('h3'); title.textContent = app.title;
  const description = document.createElement('p'); description.textContent = app.description;
  const link = document.createElement('a'); link.className = 'card-link';
  // Hanya path file relatif atau alamat web HTTP/HTTPS yang diterima.
  const href = String(app.url || '');
  const isRelative = /^(?![a-z][a-z0-9+.-]*:)(?!\/\/)[^\\\s]+$/i.test(href);
  const isWeb = /^https?:\/\//i.test(href);
  if (isRelative || isWeb) link.href = href;
  link.setAttribute('aria-label', 'Buka ' + app.title);
  const category = document.createElement('span'); category.textContent = app.category;
  const action = document.createElement('span'); action.textContent = 'Buka aplikasi';
  const arrow = document.createElement('b'); arrow.textContent = '↗'; arrow.setAttribute('aria-hidden', 'true'); action.append(arrow);
  link.append(category, action); card.append(top, title, description, link); grid.append(card);
}
function updateTime() {
  const now = new Date();
  document.getElementById('clock').textContent = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(now).replaceAll('.', ':') + ' WIB';
  document.getElementById('date').textContent = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(now);
}
updateTime(); setInterval(updateTime, 1000);
function setScene(scene) {
  const night = scene === 'malam';
  const picture = document.getElementById('hero-picture');
  picture.classList.toggle('night', night);
  picture.setAttribute('aria-label', night ? 'Ilustrasi pengawas peron dengan lentera hijau di malam hari' : 'Ilustrasi petugas memberi isyarat di Stasiun Jakarta Kota');
  document.querySelectorAll('[data-scene]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scene === scene)));
  const label = document.querySelector('.photo-label span'); label.textContent = night ? '02 /' : '01 /';
  try { localStorage.setItem('jakk-background', scene); } catch (_) { /* File lokal tetap berjalan tanpa penyimpanan browser. */ }
}
let savedScene = 'siang';
try { savedScene = localStorage.getItem('jakk-background') === 'malam' ? 'malam' : 'siang'; } catch (_) {}
setScene(savedScene);
document.querySelectorAll('[data-scene]').forEach(button => button.addEventListener('click', () => setScene(button.dataset.scene)));
