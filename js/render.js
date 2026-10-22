/* ============================================
   RENDER SEMUA UI
============================================ */

function render() {
  $('totalBalance').textContent = fmt(getTotalInIDR(), 'IDR');
  renderWallets();
  renderWalletSelector();
  renderWalletFilter();
  renderCategoryFilter();
  renderTransactionList();
}

/* --- Wallet List (termasuk Jajan & Tabungan) --- */
function renderWallets() {
  const wl = $('walletList');
  let html = '';

  // Dompet biasa
  state.wallets.forEach(w => {
    const bal = getWalletBalance(w.id);
    const color = bal < 0 ? '#ef4444' : '#2d3748';
    html += `<div class="wallet-item">
      <div class="wallet-icon">${w.icon}</div>
      <div class="wallet-info">
        <div class="wallet-name">${escapeHtml(w.name)}</div>
        <div class="wallet-curr">${w.currency}</div>
      </div>
      <div class="wallet-balance" style="color:${color}">${fmt(bal, w.currency)}</div>
      <button class="wallet-del" onclick="deleteWallet('${w.id}')" title="Hapus">🗑️</button>
    </div>`;
  });

  // Pot: Uang Jajan & Tabungan (selalu tampil, tidak bisa dihapus)
  ['jajan', 'tabungan'].forEach(pot => {
    const bal = getPotBalance(pot);
    const emoji = pot === 'jajan' ? '🍪' : '🏦';
    const label = pot === 'jajan' ? 'Uang Jajan' : 'Tabungan';
    const curr = state[pot].currency;
    const currOptions = Object.keys(CURRENCIES)
      .map(c => `<option value="${c}" ${c === curr ? 'selected' : ''}>${c}</option>`).join('');
    const extraClass = pot === 'tabungan' ? ' tabungan' : '';

    html += `<div class="wallet-item pot-item${extraClass}">
      <div class="wallet-icon">${emoji}</div>
      <div class="wallet-info">
        <div class="wallet-name">${label}<span class="badge-tetap">tetap</span></div>
        <div class="wallet-curr">
          <select class="curr-inline" onchange="changePotCurrency('${pot}', this.value)">${currOptions}</select>
        </div>
      </div>
      <div class="wallet-balance" style="color:${bal < 0 ? '#ef4444' : '#2d3748'}">${fmt(bal, curr)}</div>
    </div>`;
  });

  wl.innerHTML = html;
}

/* --- Wallet Dropdown di Form (termasuk Jajan & Tabungan) --- */
function renderWalletSelector() {
  const wsel = $('wallet');
  const prev = wsel.value;
  let html = '';

  state.wallets.forEach(w => {
    const bal = getWalletBalance(w.id);
    html += `<option value="${w.id}">${w.icon} ${escapeHtml(w.name)} — ${fmt(bal, w.currency)}</option>`;
  });

  ['jajan', 'tabungan'].forEach(pot => {
    const bal = getPotBalance(pot);
    const emoji = pot === 'jajan' ? '🍪' : '🏦';
    const label = pot === 'jajan' ? 'Uang Jajan' : 'Tabungan';
    html += `<option value="${pot}">${emoji} ${label} — ${fmt(bal, state[pot].currency)}</option>`;
  });

  wsel.innerHTML = html;
  const exists = [...wsel.options].some(o => o.value === prev);
  if (exists) wsel.value = prev;
  updateFormCurrency();
}

function renderWalletFilter() {
  const wfil = $('filterWallet');
  const prev = wfil.value;
  let html = '<option value="all">Semua Dompet</option>';
  state.wallets.forEach(w => {
    html += `<option value="${w.id}">${w.icon} ${escapeHtml(w.name)}</option>`;
  });
  html += '<option value="jajan">🍪 Uang Jajan</option>';
  html += '<option value="tabungan">🏦 Tabungan</option>';
  wfil.innerHTML = html;
  if ([...wfil.options].some(o => o.value === prev)) wfil.value = prev;
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

  const fw = $('filterWallet').value;
  if (fw !== 'all') {
    if (fw === 'jajan' || fw === 'tabungan') {
      filtered = filtered.filter(t => getDest(t) === fw);
    } else {
      filtered = filtered.filter(t => getDest(t) === 'wallet' && t.walletId === fw);
    }
  }

  if ($('filterCategory').value !== 'all') filtered = filtered.filter(t => t.category === $('filterCategory').value);

  const list = $('list');
  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state"><div class="emoji">📭</div>Belum ada transaksi</div>';
    return;
  }

  list.innerHTML = filtered.map(t => {
    let wLabel;
    const dest = getDest(t);
    if (dest === 'jajan') wLabel = '🍪 Uang Jajan';
    else if (dest === 'tabungan') wLabel = '🏦 Tabungan';
    else {
      const w = state.wallets.find(x => x.id === t.walletId);
      wLabel = w ? `${w.icon} ${escapeHtml(w.name)}` : '—';
    }
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
