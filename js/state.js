/* ============================================
   STATE GLOBAL & PENYIMPANAN
============================================ */

let state = loadState();
let currentType = 'income';

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const s = JSON.parse(saved);
    // Migrasi: kalau ada jajan.amount / tabungan.amount dari versi lama, ubah jadi transaksi
    ['jajan', 'tabungan'].forEach(pot => {
      if (s[pot] && typeof s[pot].amount === 'number' && s[pot].amount !== 0) {
        const label = pot === 'jajan' ? 'Uang Jajan' : 'Tabungan';
        s.transactions.push({
          id: Date.now() + Math.random(),
          desc: `Saldo awal ${label}`,
          amount: Math.abs(s[pot].amount),
          category: 'Lainnya',
          date: new Date().toISOString().slice(0, 10),
          type: s[pot].amount > 0 ? 'income' : 'expense',
          destination: pot,
          currency: s[pot].currency || 'IDR'
        });
        delete s[pot].amount;
      }
    });
    return s;
  }

  // Migrasi dari v1
  let transactions = [];
  try {
    const old = JSON.parse(localStorage.getItem(OLD_KEY) || '[]');
    transactions = old.map(t => ({
      ...t,
      walletId: 'w_cash',
      currency: 'IDR',
      destination: 'wallet'
    }));
  } catch (e) { /* ignore */ }

  return {
    wallets: [
      { id: 'w_cash',    name: 'Cash',           currency: 'IDR', icon: '💵' },
      { id: 'w_digital', name: 'Dompet Digital', currency: 'IDR', icon: '📱' }
    ],
    transactions,
    jajan:    { currency: 'IDR' },
    tabungan: { currency: 'IDR' }
  };
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  render();
}

/** Ambil destination transaksi dengan default backward-compat */
function getDest(t) {
  return t.destination || 'wallet';
}

/** Saldo wallet dalam IDR (dari transaksi) */
function getWalletBalanceInIDR(walletId) {
  return state.transactions
    .filter(t => getDest(t) === 'wallet' && t.walletId === walletId)
    .reduce((sum, t) => {
      const v = toIDR(t.amount, t.currency || 'IDR');
      return sum + (t.type === 'income' ? v : -v);
    }, 0);
}

/** Saldo wallet dalam kurensi wallet itu sendiri */
function getWalletBalance(walletId) {
  const w = state.wallets.find(x => x.id === walletId);
  if (!w) return 0;
  return getWalletBalanceInIDR(walletId) / CURRENCIES[w.currency].rate;
}

/** Saldo pot (jajan/tabungan) dalam IDR */
function getPotBalanceInIDR(pot) {
  return state.transactions
    .filter(t => getDest(t) === pot)
    .reduce((sum, t) => {
      const v = toIDR(t.amount, t.currency || 'IDR');
      return sum + (t.type === 'income' ? v : -v);
    }, 0);
}

/** Saldo pot dalam kurensi pot itu */
function getPotBalance(pot) {
  return getPotBalanceInIDR(pot) / CURRENCIES[state[pot].currency].rate;
}

/** Total semua aset dalam IDR (wallet + pot) */
function getTotalInIDR() {
  const wTotal = state.wallets.reduce((s, w) => s + getWalletBalanceInIDR(w.id), 0);
  return wTotal + getPotBalanceInIDR('jajan') + getPotBalanceInIDR('tabungan');
       }
