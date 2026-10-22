/* ============================================
   INISIALISASI
============================================ */

function init() {
  $('date').valueAsDate = new Date();

  document.querySelectorAll('.type-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.type-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.dataset.type;
    });
  });

  $('form').addEventListener('submit', submitTransaction);
  $('wallet').addEventListener('change', updateFormCurrency);

  $('filterType').addEventListener('change', render);
  $('filterWallet').addEventListener('change', render);
  $('filterCategory').addEventListener('change', render);

  $('clearAll').addEventListener('click', clearAllTransactions);

  render();
}

document.addEventListener('DOMContentLoaded', init);
