/* ============================================
   UANG JAJAN & TABUNGAN
============================================ */

/** Tambah/kurangi saldo pot. sign = 1 (tambah) / -1 (kurangi) */
function updatePot(pot, sign) {
  const input = $(pot + 'Input');
  const val = parseFloat(input.value);
  if (!val || val <= 0) return alert('Isi jumlah yang valid!');

  const potData = state[pot];
  const newAmount = potData.amount + (sign * val);
  if (newAmount < 0) return alert('Saldo tidak boleh minus!');

  potData.amount = newAmount;
  input.value = '';
  save();
}

/** Render tampilan kedua pot + isi selector kurensi */
function renderPots() {
  ['jajanCurrency', 'tabunganCurrency'].forEach(selId => {
    const sel = $(selId);
    if (sel.options.length === 0) {
      sel.innerHTML = Object.keys(CURRENCIES)
        .map(k => `<option value="${k}">${k}</option>`)
        .join('');
    }
  });

  $('jajanCurrency').value = state.jajan.currency;
  $('tabunganCurrency').value = state.tabungan.currency;
  $('jajanDisplay').textContent = fmt(state.jajan.amount, state.jajan.currency);
  $('tabunganDisplay').textContent = fmt(state.tabungan.amount, state.tabungan.currency);
}

/** Ganti kurensi sebuah pot */
function changePotCurrency(pot, currency) {
  state[pot].currency = currency;
  save();
}
