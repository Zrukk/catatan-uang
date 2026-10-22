/* ============================================
   STATE GLOBAL & PENYIMPANAN
   Semua data aplikasi disimpan di object `state`.
============================================ */

let state = loadState();
let currentType = 'income'; // 'income' | 'expense'

/** Muat state dari localStorage (dengan migrasi v1) */
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  // Migrasi dari versi 1 (tanpa dompet)
  let transactions = [];
  try {
    const old = JSON.parse(localStorage.getItem(OLD_KEY) || '[]');
    transactions = old.map(t => ({ ...t, walletId: 'w_cash', currency: 'IDR' }));
  } catch (e) { /* ignore */ }

  return {
    wallets: [
      { id: 'w_cash',    name: 'Cash',           currency: 'IDR', icon: '💵' },
      { id: 'w_digital', name: 'Dompet Digital', currency: 'IDR', icon: '📱' }
    ],
    transactions,
    jajan:    { amount: 0, currency: 'IDR' },
    tabungan: { amount: 0, currency: 'IDR' }
  };
}

/** Simpan state ke localStorage lalu render ulang */
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  render();
}

/** Hitung saldo satu dompet (dalam kurensi dompet itu) */
function getWalletBalance(walletId) {
  const w = state.wallets.find(x => x.id === walletId);
  if (!w) return 0;
  return state.transactions
    .filter(t => t.walletId === walletId)
    .reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
}

/** Total semua dompet setelah dikonversi ke IDR */
function getTotalInIDR() {
  return state.wallets.reduce((sum, w) => {
    return sum + toIDR(getWalletBalance(w.id), w.currency);
  }, 0);
}
