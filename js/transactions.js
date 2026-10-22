/* ============================================
   TRANSAKSI
============================================ */

function updateFormCurrency() {
  const dest = $('wallet').value;
  let currency;
  if (dest === 'jajan' || dest === 'tabungan') {
    currency = state[dest].currency;
  } else {
    const w = state.wallets.find(x => x.id === dest);
    if (!w) return;
    currency = w.currency;
  }
  $('formCurrPrefix').textContent = CURRENCIES[currency]?.symbol || '';
}

function submitTransaction(e) {
  e.preventDefault();
  const dest = $('wallet').value;

  const tx = {
    id: Date.now(),
    desc: $('desc').value.trim(),
    amount: parseFloat($('amount').value),
    category: $('category').value,
    date: $('date').value,
    type: currentType
  };

  // Tentukan tujuan
  if (dest === 'jajan' || dest === 'tabungan') {
    tx.destination = dest;
    tx.currency = state[dest].currency;
  } else {
    const w = state.wallets.find(x => x.id === dest);
    if (!w) return alert('Pilih dompet terlebih dahulu!');
    tx.destination = 'wallet';
    tx.walletId = dest;
    tx.currency = w.currency;
  }

  if (!tx.desc || !tx.amount || tx.amount <= 0) return alert('Isi data dengan benar!');
  state.transactions.push(tx);
  save();

  // Reset form, pertahankan pilihan dompet
  const savedDest = dest;
  $('form').reset();
  $('date').valueAsDate = new Date();
  $('wallet').value = savedDest;
  updateFormCurrency();
}

function deleteTx(id) {
  if (!confirm('Hapus transaksi ini?')) return;
  state.transactions = state.transactions.filter(t => t.id !== id);
  save();
}

function clearAllTransactions() {
  if (!state.transactions.length) return;
  if (!confirm('Hapus SEMUA transaksi? Tidak bisa dibatalkan.')) return;
  state.transactions = [];
  save();
     }
