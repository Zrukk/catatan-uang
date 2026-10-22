/* ============================================
   RENDER SEMUA UI
============================================ */

/** Fungsi render utama — dipanggil setiap kali data berubah */
function render() {
  $('totalBalance').textContent = fmt(getTotalInIDR(), 'IDR');
  renderWallets();
  renderWalletSelector();
  renderWalletFilter();
  renderCategoryFilter();
  renderPots();
  renderTransactionList();
}

function renderWallets() {
  const wl = $('walletList');
  if (!state.wallets.length) {
    wl.innerHTML = '<div class="empty-state"><div class="emoji">👛</div>Belum ada dompet</div>';
    return;
  }
  wl.innerHTML = state.wallets.map(w => {
    const bal = getWalletBalance(w.id);
    const color = bal < 0 ? '#ef4444' : '#2d3748';
    return `<div class="wallet-item">
      <div class="wallet-icon">${w.icon}</div>
      <div class="wallet-info">
        <div class="wallet-name">${escapeHtml(w.name)}</div>
        <div class="wallet-curr">${w.currency}</div>
      </div>
      <div class="wallet-balance" style="color:${color}">${fmt(bal, w.currency)}</div>
      <button class="wallet-del" onclick="deleteWallet('${w.id}')" title="Hapus">🗑️</button>
    </div>`;
  }).join('');
}

function renderWalletSelector() {
  const wsel = $('wallet');
  const prev = wsel.value;
  wsel.innerHTML = state.wallets.map(w => {
    const bal = getWalletBalance(w.id);
    return `<option value="${w.id}">${w.icon} ${escapeHtml(w.name)} — ${fmt(bal, w.currency)}</option>`;
  }).join('');
  if (state.wallets.some(w => w.id === prev)) wsel.value = prev;
  updateFormCurrency();
}

function renderWalletFilter() {
  const wfil = $('filterWallet');
  const prev = wfil.value;
  wfil.innerHTML = '<option value="all">Semua Dompet</option>' +
    state.wallets.map(w => `<option value="${w.id}">${w.icon} ${escapeHtml(w.name)}</option>`).join('');
  if (prev === 'all' || state.wallets.some(w => w.id === prev)) wfil.value = prev;
}

function renderCategoryFilter() {
  const cats = [...new Set(state.transactions.map(t => t.category))].sort();
  const fcat = $('filterCategory');
  const prev = fcat.value;
  fcat.innerHTML = '<option value="all">Semua Kategori</option>' +
    cats.map(c => `<option value="${c}">${CATEGORY_EMOJI[c] || '📦'} ${c}</option>`).join('');
  if (prev === 'all' || cats.includes(prev)) fcat.value = prev;
}

function renderTransactionList() {
  let filtered = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  if ($('filterType').value !== 'all') filtered = filtered.filter(t => t.type === $('filterType').value);
  if ($('filterWallet').value !== 'all') filtered = filtered.filter(t => t.walletId === $('filterWallet').value);
  if ($('filterCategory').value !== 'all') filtered = filtered.filter(t => t.category === $('filterCategory').value);

  const list = $('list');
  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state"><div class="emoji">📭</div>Belum ada transaksi</div>';
    return;
  }

  list.innerHTML = filtered.map(t => {
    const w = state.wallets.find(x => x.id === t.walletId);
    const wLabel = w ? `${w.icon} ${escapeHtml(w.name)}` : '—';
    return `<div class="transaction-item">
      <div class="transaction-icon ${t.type}">${CATEGORY_EMOJI[t.category] || '📦'}</div>
      <div class="transaction-info">
        <div class="transaction-title">${escapeHtml(t.desc)}</div>
        <div class="transaction-meta">${t.category} • ${wLabel} • ${formatDate(t.date)}</div>
      </div>
      <div class="transaction-amount ${t.type}">
        ${t.type === 'income' ? '+' : '-'} ${fmt(t.amount, t.currency || 'IDR')}
      </div>
      <button class="btn-delete" onclick="deleteTx(${t.id})">🗑️</button>
    </div>`;
  }).join('');
        }
