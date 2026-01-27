const fallbackMessages = {
  '/app1': 'Hello this Apps 1!',
  '/app2': 'Hello this App 2!',
};

const fetchJson = async (endpoint) => {
  const response = await fetch(endpoint, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
};

const updateCard = async (card) => {
  const { endpoint } = card.dataset;
  const value = card.querySelector('.value');
  const note = card.querySelector('.note');
  if (!value || !note || !endpoint) {
    return;
  }

  value.textContent = 'Memuat…';
  note.textContent = 'Menghubungkan ke endpoint…';

  try {
    const payload = await fetchJson(endpoint);
    if (endpoint === '/status') {
      const uptime = Math.round(payload.uptime ?? 0);
      value.textContent = `uptime ${uptime}s · ${payload.status ?? 'ok'}`;
      note.textContent = `Versi ${payload.version ?? '–'} · ${payload.env ?? 'dev'}`;
    } else {
      const message =
        payload.message ||
        (typeof payload === 'string' ? payload : JSON.stringify(payload, null, 0));
      value.textContent = message;
      note.textContent = 'Respons valid dari layanan.';
    }
    card.dataset.state = 'success';
  } catch (error) {
    value.textContent = fallbackMessages[endpoint] ?? 'Server tidak tersedia';
    note.textContent = 'Menampilkan data lokal sementara.';
    card.dataset.state = 'error';
    console.warn(`Failed to fetch ${endpoint}:`, error);
  }
};

const kickoff = () => {
  const cards = Array.from(document.querySelectorAll('[data-endpoint]'));
  cards.forEach(updateCard);
  setInterval(() => cards.forEach(updateCard), 15000);
};

if (typeof globalThis !== 'undefined' && globalThis.window) {
  globalThis.window.addEventListener('DOMContentLoaded', kickoff);
}
