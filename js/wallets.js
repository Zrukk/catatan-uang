/* ============================================
   MANAJEMEN DOMPET
============================================ */

/** Buka/tutup form tambah dompet */
function toggleWalletForm() {
  const f = $('walletForm');
  f.style.display = f.style.display === 'none' ? 'grid' : 'none';
  if (f.style.display === 'grid') $('walletName').focus();
}

/** Tambah dompet baru */
function addWallet() {
  const name = $('walletName').value.trim();
  const currency = $('walletCurrency').value;
  const icon = $('walletIcon').value;
  if (!name) return alert('Isi nama dompet!');

  state.wallets.push({ id: 'w_' + Date.now(), name, currency, icon });
  $('walletName').value = '';
  toggleWalletForm();
  save();
}

/** Hapus dompet (beserta transaksinya) */
function deleteWallet(id) {
  if (state.wallets.length <= 1) return alert('Minimal harus ada 1 dompet!');

  const txCount = state.transactions.filter(t => t.walletId === id).length;
  const msg = txCount > 0
    ? `Dompet ini punya ${txCount} transaksi. Hapus dompet BESERTA transaksinya?`
    : 'Hapus dompet ini?';
  if (!confirm(msg)) return;

  state.wallets = state.wallets.filter(w => w.id !== id);
  state.transactions = state.transactions.filter(t => t.walletId !== id);
  save();
}
