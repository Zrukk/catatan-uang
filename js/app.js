/* ============================================
   INISIALISASI APLIKASI
   Tempat semua event listener didaftarkan.
============================================ */

function init() {
  // Set tanggal hari ini di form
  $('date').valueAsDate = new Date();

  // Toggle tipe pemasukan/pengeluaran
  document.querySelectorAll('.type-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.type-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.dataset.type;
    });
  });

  // Form submit
  $('form').addEventListener('submit', submitTransaction);

  // Update simbol kurensi saat ganti dompet
  $('wallet').addEventListener('change', updateFormCurrency);

  // Filter
  $('filterType').addEventListener('change', render);
  $('filterWallet').addEventListener('change', render);
  $('filterCategory').addEventListener('change', render);

  // Hapus semua
  $('clearAll').addEventListener('click', clearAllTransactions);

  // Ganti kurensi pot
  $('jajanCurrency').addEventListener('change', e => changePotCurrency('jajan', e.target.value));
  $('tabunganCurrency').addEventListener('change', e => changePotCurrency('tabungan', e.target.value));

  // Render awal
  render();
}

// Jalankan setelah DOM siap
document.addEventListener('DOMContentLoaded', init);
