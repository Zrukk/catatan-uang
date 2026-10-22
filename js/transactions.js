/* ============================================
   TRANSAKSI (pemasukan & pengeluaran)
============================================ */

/** Update prefix simbol kurensi di input jumlah */
function updateFormCurrency() {
  const w = state.wallets.find(x => x.id === $('wallet').value);
  if (w) $('formCurrPrefix').textContent = CURRENCIES[w.currency]?.symbol || '';
}

/** Handler submit form transaksi */
function submitTransaction(e) {
  e.preventDefault();

  const walletId = $('wallet').value;
  const wallet = state.wallets.find(w => w.id === walletId);
  if (!wallet) return alert('Pilih dompet terlebih dahulu!');

  const tx = {
    id: Date.now(),
    desc: $('desc').value.trim(),
    amount: parseFloat($('amount').value),
    category: $('category').value,
    date: $('date').value,
    type: currentType,
    walletId,
    currency: wallet.currency
  };

  if (!tx.desc || !tx.amount || tx.amount <= 0) return alert('Isi data dengan benar!');
  state.transactions.push(tx);
  save();

  // Reset form, pertahankan dompet terpilih
  $('form').reset();
  $('date').valueAsDate = new Date();
  $('wallet').value = walletId;
  updateFormCurrency();
}

/** Hapus satu transaksi */
function deleteTx(id) {
  if (!confirm('Hapus transaksi ini?')) return;
  state.transactions = state.transactions.filter(t => t.id !== id);
  save();
}

/** Hapus semua transaksi */
function clearAllTransactions() {
  if (!state.transactions.length) return;
  if (!confirm('Hapus SEMUA transaksi? Tidak bisa dibatalkan.')) return;
  state.transactions = [];
  save();
    }
