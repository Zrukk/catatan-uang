/* ============================================
   UTILITAS UMUM
============================================ */

const $ = id => document.getElementById(id);

/** Format angka jadi string dengan simbol kurensi */
function fmt(amount, currency = 'IDR') {
  const sym = CURRENCIES[currency]?.symbol || '';
  return sym + ' ' + Number(amount).toLocaleString('id-ID', { maximumFractionDigits: 2 });
}

/** Konversi nilai dari kurensi tertentu ke IDR */
function toIDR(amount, currency) {
  return amount * (CURRENCIES[currency]?.rate || 1);
}

/** Escape HTML agar aman dari XSS saat render */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

/** Format tanggal ke "12 Okt 2026" */
function formatDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
