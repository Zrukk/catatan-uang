/* ============================================
   UANG JAJAN & TABUNGAN
   Sekarang diperlakukan sebagai "virtual wallet".
   Balance dihitung dari transaksi (bukan state).
============================================ */

/** Ganti kurensi pot */
function changePotCurrency(pot, currency) {
  state[pot].currency = currency;
  save();
}
