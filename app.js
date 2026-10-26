'use strict';

const app = document.getElementById('app');
const toastElement = document.getElementById('toast');

const state = {
  tab: 'home',
  theme: 'light',
  currency: 'NGN',
  balance: 125430,
  hideBalance: false,
  transactionQuery: '',
  transactionFilter: 'All',
  scannerMode: 'scan',
  flashEnabled: false,
  modal: null,
  transactions: [
    { title: 'Electricity bill', detail: 'Ikeja Electric · Today, 10:24', category: 'Utilities', amount: -5000, icon: 'bolt', status: 'Success' },
    { title: 'Airtime purchase', detail: 'MTN Nigeria · Yesterday, 16:12', category: 'Airtime', amount: -1000, icon: 'phone', status: 'Success' },
    { title: 'Wallet top up', detail: 'GTBank •• 4821 · 18 Sep, 09:30', category: 'Income', amount: 50000, icon: 'arrow-down', status: 'Success' },
    { title: 'Money sent', detail: 'To Amara Okafor · 17 Sep, 14:45', category: 'Transfer', amount: -25000, icon: 'arrow-up', status: 'Success' }
  ]
};

const quickActions = [
  { label: 'Electricity', icon: 'bolt', action: 'service', service: 'Electricity' },
  { label: 'Airtime', icon: 'phone', action: 'service', service: 'Airtime' },
  { label: 'Data', icon: 'signal', action: 'service', service: 'Data' },
  { label: 'Send', icon: 'arrow-up', action: 'send' },
  { label: 'Receive', icon: 'arrow-down', action: 'receive' },
  { label: 'Bank', icon: 'bank', action: 'service', service: 'Bank transfer' }
];

const services = [
  { name: 'Electricity', icon: 'bolt' },
  { name: 'Airtime', icon: 'phone' },
  { name: 'Data', icon: 'signal' },
  { name: 'Cable TV', icon: 'tv' },
  { name: 'Water', icon: 'water' },
  { name: 'Internet', icon: 'wifi' },
  { name: 'School fees', icon: 'school' },
  { name: 'Insurance', icon: 'shield' },
  { name: 'Flights', icon: 'plane' },
  { name: 'Gift cards', icon: 'gift' }
];

const iconPaths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
  scan: '<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M8 8h3v3H8zM14 8h2M14 11h3M8 14h3v3H8zM14 14h3v3h-3z"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
  moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.6 8.6 0 1 0 11 11z"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
  'eye-off': '<path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A11.8 11.8 0 0 1 12 5c6.5 0 10 7 10 7a15 15 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7a11 11 0 0 0 3.4-.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  'arrow-up': '<path d="M12 19V5m-7 7 7-7 7 7"/>',
  'arrow-down': '<path d="M12 5v14m7-7-7 7-7-7"/>',
  bolt: '<path d="m13 2-3 8h7l-6 12 1-9H5l8-11z"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/>',
  signal: '<path d="M3 18h2m3-4h2m3-4h2m3-4h2"/><path d="M4 21V17m5 4V13m5 8V9m5 12V5"/>',
  bank: '<path d="m3 10 9-6 9 6"/><path d="M4 10h16M5 10v8m4-8v8m6-8v8m4-8v8M3 21h18M3 18h18"/>',
  tv: '<rect x="3" y="5" width="18" height="13" rx="2"/><path d="m8 2 4 3 4-3M8 22h8"/>',
  water: '<path d="M12 22a7 7 0 0 0 7-7c0-4-7-13-7-13S5 11 5 15a7 7 0 0 0 7 7z"/><path d="M9 16a3 3 0 0 0 3 3"/>',
  wifi: '<path d="M5 12.5a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0m-5 3a2 2 0 0 1 2 0"/>',
  school: '<path d="m3 10 9-6 9 6-9 6z"/><path d="M7 13v5c3 2 7 2 10 0v-5M21 10v7"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><path d="m9 12 2 2 4-4"/>',
  plane: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
  gift: '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9v12M3 13h18M12 9H7.5a2.5 2.5 0 1 1 2.5-2.5C10 8 12 9 12 9zm0 0h4.5A2.5 2.5 0 1 0 14 6.5C14 8 12 9 12 9z"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
  close: '<path d="m18 6-12 12M6 6l12 12"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  flash: '<path d="m13 2-3 8h7l-6 12 1-9H5l8-11z"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.6.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.6-.7 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 1.7z"/>',
  help: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3m.1 4h.01"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/>',
  logout: '<path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  exchange: '<path d="m7 7 3-3 3 3M10 4v12m7 1-3 3-3-3m3 3V8"/>'
};

function icon(name, className = '') {
  const paths = iconPaths[name] || iconPaths.grid;
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

function money(amount, currency = state.currency) {
  const value = currency === 'USD' ? amount / 1500 : amount;
  if (currency === 'USD') {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function balanceText() {
  return state.hideBalance ? '••••••••' : money(state.balance);
}

function pageIntro(kicker, title, subtitle) {
  return `<header class="page-intro"><span class="section-kicker">${kicker}</span><h1 class="page-title">${title}</h1><p class="page-subtitle">${subtitle}</p></header>`;
}

function renderTopbar() {
  return `<header class="topbar">
    <div class="brand-mark" aria-hidden="true"><svg viewBox="0 0 40 40"><path d="M27.8 12.7a12 12 0 1 0 0 14.6" fill="none" stroke="currentColor" stroke-width="5.2" stroke-linecap="round"/><circle cx="30.2" cy="20" r="2.5" fill="currentColor"/></svg></div>
    <div class="brand-copy"><p class="brand-name">Clanda</p><p class="brand-tagline">Money, made simple.</p></div>
    <button class="icon-button" type="button" data-action="toggle-theme" aria-label="Switch to ${state.theme === 'dark' ? 'light' : 'dark'} theme">${icon(state.theme === 'dark' ? 'sun' : 'moon')}</button>
    <button class="icon-button notification-button" type="button" data-action="notifications" aria-label="Notifications">${icon('bell')}</button>
    <button class="avatar" type="button" data-tab="profile" aria-label="Open profile">AO</button>
  </header>`;
}

function renderBalanceCard() {
  return `<section class="balance-card" aria-label="Wallet balance">
    <div class="balance-label-row"><p class="eyebrow">TOTAL BALANCE</p><button class="balance-hide" type="button" data-action="toggle-balance" aria-label="${state.hideBalance ? 'Show' : 'Hide'} balance">${icon(state.hideBalance ? 'eye-off' : 'eye')}</button></div>
    <div class="balance-value-row"><p class="balance-amount" aria-live="polite">${balanceText()}</p></div>
    <div class="wallet-row" aria-label="Choose wallet">
      <button class="wallet-chip" type="button" data-currency="NGN" aria-pressed="${state.currency === 'NGN'}">NGN wallet</button>
      <button class="wallet-chip" type="button" data-currency="USD" aria-pressed="${state.currency === 'USD'}">USD wallet</button>
    </div>
  </section>`;
}

function transactionRow(transaction) {
  const signedAmount = `${transaction.amount > 0 ? '+' : '−'}${money(Math.abs(transaction.amount))}`;
  const title = escapeHtml(transaction.title);
  const detail = escapeHtml(transaction.detail);
  return `<article class="transaction-row" data-transaction data-title="${escapeHtml(transaction.title.toLowerCase())}" data-category="${escapeHtml(transaction.category)}">
    <div class="transaction-icon">${icon(transaction.icon)}</div>
    <div class="transaction-copy"><p class="transaction-title">${title}</p><p class="transaction-meta">${detail}</p></div>
    <div class="transaction-value"><p class="transaction-amount ${transaction.amount > 0 ? 'credit' : ''}">${signedAmount}</p><p class="transaction-status">${escapeHtml(transaction.status)}</p></div>
  </article>`;
}

function renderHome() {
  const quickButtons = quickActions.map((item) => `<button class="quick-action" type="button" data-action="${item.action}"${item.service ? ` data-service="${escapeHtml(item.service)}"` : ''}>
    <span class="quick-icon">${icon(item.icon)}</span><span class="quick-label">${item.label}</span></button>`).join('');
  const recent = state.transactions.slice(0, 3).map(transactionRow).join('');
  return `${renderTopbar()}${renderBalanceCard()}
    <div class="wallet-actions">
      <button class="primary-action" type="button" data-action="add">${icon('plus')}Add Money</button>
      <button class="secondary-action" type="button" data-action="send">${icon('arrow-up')}Send Money</button>
    </div>
    <section class="section" aria-labelledby="quick-actions-title">
      <div class="section-heading"><div><span class="section-kicker">EVERYDAY PAYMENTS</span><h2 class="section-title" id="quick-actions-title">Quick actions</h2></div></div>
      <div class="quick-grid">${quickButtons}</div>
    </section>
    <section class="promo-card" aria-label="Clanda payments">
      <div class="promo-copy"><p class="promo-label">CLANDA PAYMENTS</p><h2 class="promo-title">Pay bills. Send money.</h2><p class="promo-description">Fast, secure, distinctly yours.</p>
        <button class="promo-cta" type="button" data-tab="services">Explore services ${icon('chevron')}</button></div>
    </section>
    <section class="section" aria-labelledby="recent-title">
      <div class="section-heading"><div><span class="section-kicker">LATEST ACTIVITY</span><h2 class="section-title" id="recent-title">Recent transactions</h2></div><button class="text-button" type="button" data-tab="transactions">See all ${icon('chevron')}</button></div>
      <div class="transaction-list transaction-list-card">${recent}</div>
    </section>${renderNav()}`;
}

function filteredTransactions() {
  const query = state.transactionQuery.trim().toLowerCase();
  return state.transactions.filter((transaction) => {
    const matchesQuery = !query || `${transaction.title} ${transaction.detail} ${transaction.category}`.toLowerCase().includes(query);
    const matchesFilter = state.transactionFilter === 'All' || transaction.category === state.transactionFilter;
    return matchesQuery && matchesFilter;
  });
}

function renderTransactions() {
  const filters = ['All', 'Transfer', 'Utilities', 'Airtime', 'Income'];
  const chips = filters.map((filter) => `<button class="filter-chip" type="button" data-filter="${filter}" aria-pressed="${state.transactionFilter === filter}">${filter}</button>`).join('');
  const rows = filteredTransactions().map(transactionRow).join('');
  return `${renderTopbar()}${pageIntro('YOUR WALLET', 'Transactions', 'Keep track of every payment, transfer and top up.')}
    <label class="search-box">${icon('search')}<input id="transaction-search" type="search" placeholder="Search transactions" value="${escapeHtml(state.transactionQuery)}" aria-label="Search transactions"></label>
    <div class="filter-row" aria-label="Filter transactions">${chips}</div>
    <p class="activity-date">Recent activity</p>
    <div class="transaction-list" id="all-transactions">${rows || '<p class="empty-state">No transactions match your search.</p>'}</div>
    ${renderNav()}`;
}

function renderScanner() {
  const scanMode = state.scannerMode === 'scan';
  const codeMarkup = '<div class="code-card"><div><div class="fake-qr" aria-label="Demo Clanda QR code">' + Array.from({ length: 81 }, () => '<span></span>').join('') + '</div><p class="code-label">Scan to pay Ada Okafor</p></div></div>';
  return `${renderTopbar()}${pageIntro('QUICK AND SECURE', 'Scan & Pay', 'Scan a Clanda QR code or share yours to get paid.')}
    <div class="scanner-toggle" role="group" aria-label="Scanner mode">
      <button type="button" data-scan-mode="scan" aria-pressed="${scanMode}">Scan QR</button>
      <button type="button" data-scan-mode="code" aria-pressed="${!scanMode}">My Code</button>
    </div>
    ${scanMode ? `<section class="scanner-card" aria-label="QR scanner preview">
      <div class="scan-frame"><span class="scan-corner tl"></span><span class="scan-corner tr"></span><span class="scan-corner bl"></span><span class="scan-corner br"></span>${icon('scan')}<span class="scan-line"></span></div>
      <p class="scan-description">Position a QR code inside the frame to scan</p>
    </section>
    <div class="scanner-tools">
      <button class="tool-button" type="button" data-action="toggle-flash" aria-pressed="${state.flashEnabled}">${icon('flash')}${state.flashEnabled ? 'Flash on' : 'Flash'}</button>
      <button class="tool-button" type="button" data-action="gallery">${icon('image')}Open gallery</button>
      <input id="gallery-input" type="file" accept="image/*" hidden aria-label="Choose a QR image">
    </div>` : codeMarkup}${renderNav()}`;
}

function renderServices() {
  const buttons = services.map((service) => `<button class="service-button" type="button" data-action="service" data-service="${escapeHtml(service.name)}">
    <span class="service-icon">${icon(service.icon)}</span><span class="service-name">${service.name}</span></button>`).join('');
  return `${renderTopbar()}${pageIntro('ONE TAP AWAY', 'Services', 'Your everyday Nigerian payments, all in one place.')}
    <div class="service-feature"><span class="service-icon">${icon('bolt')}</span><div class="service-feature-copy"><strong>Pay a bill in seconds</strong><span>Utilities, subscriptions and more.</span></div>${icon('chevron', 'setting-chevron')}</div>
    <section class="service-grid" aria-label="Available services">${buttons}</section>
    <section class="section"><div class="promo-card"><div class="promo-copy"><p class="promo-label">MADE FOR EVERY DAY</p><h2 class="promo-title">Simple, secure payments</h2><p class="promo-description">Choose a service to get started.</p></div></div></section>${renderNav()}`;
}

function settingRow(label, iconName, value = ' ', action = 'settings') {
  return `<button class="setting-row" type="button" data-action="${action}"><span class="setting-icon">${icon(iconName)}</span><span class="setting-label">${label}</span><span class="setting-value">${value}</span>${icon('chevron', 'setting-chevron')}</button>`;
}

function renderProfile() {
  return `${renderTopbar()}${pageIntro('YOUR ACCOUNT', 'Profile', 'Manage your Clanda account and preferences.')}
    <section class="profile-card"><div class="profile-avatar">AO</div><div><h2 class="profile-name">Ada Okafor</h2><p class="profile-id">ada.okafor@email.com · Clanda ID 8024 1936</p></div></section>
    <p class="profile-section-title">ACCOUNT</p>
    <div class="settings-list">${settingRow('Personal information', 'user')}${settingRow('Security & PIN', 'lock')}${settingRow('Bank accounts', 'bank')}</div>
    <p class="profile-section-title">PREFERENCES</p>
    <div class="settings-list">
      <button class="setting-row" type="button" data-action="toggle-theme"><span class="setting-icon">${icon(state.theme === 'dark' ? 'sun' : 'moon')}</span><span class="setting-label">Appearance</span><span class="setting-value">${state.theme === 'dark' ? 'Dark mode' : 'Light mode'}</span>${icon('chevron', 'setting-chevron')}</button>
      ${settingRow('Notifications', 'bell', 'On')}${settingRow('Help & support', 'help')}
      <button class="setting-row" type="button" data-action="copy-id"><span class="setting-icon">${icon('copy')}</span><span class="setting-label">Copy Clanda ID</span><span class="setting-value">8024 1936</span>${icon('chevron', 'setting-chevron')}</button>
    </div>
    <p class="profile-section-title">SESSION</p><div class="settings-list">${settingRow('Log out', 'logout', '', 'logout')}</div>${renderNav()}`;
}

function renderNav() {
  const items = [
    { tab: 'home', label: 'Home', icon: 'home' },
    { tab: 'transactions', label: 'Transactions', icon: 'list' },
    { tab: 'scan', label: 'Scan & Pay', icon: 'scan', scan: true },
    { tab: 'services', label: 'Services', icon: 'grid' },
    { tab: 'profile', label: 'Profile', icon: 'user' }
  ];
  return `<nav class="bottom-nav" aria-label="Main navigation">${items.map((item) => `<button class="nav-item${item.scan ? ' scan-nav' : ''}" type="button" data-tab="${item.tab}" aria-current="${state.tab === item.tab ? 'page' : 'false'}" aria-label="${item.label}">
    ${item.scan ? `<span class="nav-icon">${icon(item.icon)}</span>` : icon(item.icon)}<span>${item.label}</span></button>`).join('')}</nav>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function renderModal() {
  if (!state.modal) return '';
  if (state.modal.type === 'receive') {
    return `<div class="modal-backdrop" data-close-modal><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal-handle"></div><div class="modal-heading-row"><div><h2 class="modal-title" id="modal-title">Receive money</h2><p class="modal-description">Share your Clanda account details to receive a transfer.</p></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon('close')}</button></div>
      <label class="form-field">Account name<input readonly value="Ada Okafor"></label><label class="form-field">Clanda account number<input readonly value="8024 1936"></label>
      <button class="modal-submit" type="button" data-action="copy-id">${icon('copy')}Copy account details</button><p class="modal-footnote">Your account details are safe to share.</p>
    </section></div>`;
  }
  const isAdd = state.modal.type === 'add';
  const isSend = state.modal.type === 'send';
  const title = isAdd ? 'Add money' : isSend ? 'Send money' : `Pay ${escapeHtml(state.modal.service)}`;
  const description = isAdd ? 'Top up your wallet using a bank transfer.' : isSend ? 'Send money to another Clanda user.' : `Pay ${escapeHtml(state.modal.service)} securely from your wallet.`;
  const extraField = isSend
    ? '<label class="form-field">Recipient<input name="recipient" autocomplete="name" placeholder="Name or Clanda ID" required></label>'
    : state.modal.type === 'service' ? '<label class="form-field">Account or reference number<input name="account" autocomplete="off" placeholder="Enter account number" required></label>' : '<label class="form-field">From<input name="account" value="My linked bank account" autocomplete="off"></label>';
  const submitText = isAdd ? 'Add money' : isSend ? 'Send money' : 'Pay now';
  return `<div class="modal-backdrop" data-close-modal><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-handle"></div><div class="modal-heading-row"><div><h2 class="modal-title" id="modal-title">${title}</h2><p class="modal-description">${description}</p></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon('close')}</button></div>
    <form id="payment-form" data-form-action="${state.modal.type}" novalidate>
      ${extraField}
      <label class="form-field">Amount (${state.currency})<input name="amount" type="number" inputmode="decimal" min="1" step="0.01" placeholder="${state.currency === 'USD' ? '0.00' : '1,000'}" required></label>
      <button class="modal-submit" type="submit">${icon(isAdd ? 'arrow-down' : isSend ? 'arrow-up' : 'check')}${submitText}</button>
      <p class="modal-footnote">Demo only — no real money will move.</p>
    </form>
  </section></div>`;
}

function render() {
  app.dataset.theme = state.theme;
  const pages = {
    home: renderHome,
    transactions: renderTransactions,
    scan: renderScanner,
    services: renderServices,
    profile: renderProfile
  };
  app.innerHTML = `${pages[state.tab]()}<div id="modal-root">${renderModal()}</div>`;
  if (state.modal && state.modal.type !== 'receive') {
    app.querySelector('[name="amount"]')?.focus();
  }
}

let toastTimer;
function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastElement.classList.remove('is-visible'), 2500);
}

function openModal(type, service = '') {
  state.modal = { type, service };
  render();
}

function changeTab(tab) {
  if (!['home', 'transactions', 'scan', 'services', 'profile'].includes(tab)) return;
  state.tab = tab;
  state.modal = null;
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  render();
}

function handleAction(action, element) {
  if (action === 'add') openModal('add');
  else if (action === 'send') openModal('send');
  else if (action === 'receive') openModal('receive');
  else if (action === 'service') openModal('service', element.dataset.service || 'Service');
  else if (action === 'toggle-theme') toggleTheme();
  else if (action === 'toggle-balance') {
    state.hideBalance = !state.hideBalance;
    render();
  } else if (action === 'toggle-flash') {
    state.flashEnabled = !state.flashEnabled;
    render();
    showToast(state.flashEnabled ? 'Flash enabled' : 'Flash disabled');
  } else if (action === 'gallery') {
    app.querySelector('#gallery-input')?.click();
  } else if (action === 'close-modal') {
    state.modal = null;
    render();
  } else if (action === 'copy-id') {
    const details = 'Ada Okafor · Clanda ID 8024 1936';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(details)
        .then(() => showToast('Clanda account details copied'))
        .catch(() => showToast(`Clanda ID: 8024 1936`));
    } else {
      showToast('Clanda ID: 8024 1936');
    }
  } else if (action === 'settings') {
    showToast('This setting is part of the demo');
  } else if (action === 'logout') {
    showToast('You are using a demo account');
  } else if (action === 'notifications') {
    showToast('You’re all caught up');
  }
}

function applyTransactionFilters() {
  const rows = app.querySelectorAll('[data-transaction]');
  const query = state.transactionQuery.trim().toLowerCase();
  rows.forEach((row) => {
    const matchesQuery = row.dataset.title.includes(query) || row.textContent.toLowerCase().includes(query);
    const matchesFilter = state.transactionFilter === 'All' || row.dataset.category === state.transactionFilter;
    row.hidden = !matchesQuery || !matchesFilter;
  });
  const visible = Array.from(rows).some((row) => !row.hidden);
  let empty = app.querySelector('.empty-state');
  if (!visible && !empty) {
    empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'No transactions match your search.';
    app.querySelector('#all-transactions')?.append(empty);
  } else if (visible && empty) {
    empty.remove();
  }
}

app.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const tabButton = target?.closest('[data-tab]');
  if (tabButton) {
    changeTab(tabButton.dataset.tab);
    return;
  }
  const currencyButton = target?.closest('[data-currency]');
  if (currencyButton) {
    state.currency = currencyButton.dataset.currency;
    render();
    return;
  }
  const filterButton = target?.closest('[data-filter]');
  if (filterButton) {
    state.transactionFilter = filterButton.dataset.filter;
    render();
    return;
  }
  const modeButton = target?.closest('[data-scan-mode]');
  if (modeButton) {
    state.scannerMode = modeButton.dataset.scanMode;
    render();
    return;
  }
  const actionButton = target?.closest('[data-action]');
  if (actionButton) {
    handleAction(actionButton.dataset.action, actionButton);
    return;
  }
  if (target?.matches('[data-close-modal]')) {
    state.modal = null;
    render();
  }
});

app.addEventListener('input', (event) => {
  if (event.target instanceof HTMLInputElement && event.target.id === 'transaction-search') {
    state.transactionQuery = event.target.value;
    applyTransactionFilters();
  }
  if (event.target instanceof HTMLInputElement && event.target.id === 'gallery-input' && event.target.files?.length) {
    showToast(`Selected ${event.target.files[0].name}`);
  }
});

app.addEventListener('submit', (event) => {
  if (!(event.target instanceof HTMLFormElement) || event.target.id !== 'payment-form') return;
  event.preventDefault();
  const form = event.target;
  const amountField = form.elements.namedItem('amount');
  const action = form.dataset.formAction;
  const accountField = form.elements.namedItem(action === 'send' ? 'recipient' : 'account');
  const account = String(accountField?.value || '').trim();
  if (action !== 'add' && !account) {
    accountField?.setCustomValidity(action === 'send' ? 'Enter a recipient.' : 'Enter an account or reference number.');
    accountField?.reportValidity();
    return;
  }
  accountField?.setCustomValidity('');
  amountField?.setCustomValidity('');
  const amount = Number(amountField?.value);
  if (!Number.isFinite(amount) || amount <= 0) {
    amountField?.setCustomValidity('Enter an amount greater than zero.');
    amountField?.reportValidity();
    return;
  }
  const amountInNaira = state.currency === 'USD' ? amount * 1500 : amount;
  const isAdd = action === 'add';
  if (!isAdd && amountInNaira > state.balance) {
    showToast('Not enough funds in this demo wallet');
    return;
  }
  const serviceName = state.modal?.service || 'Service';
  if (isAdd) {
    state.balance += amountInNaira;
  } else {
    state.balance -= amountInNaira;
  }
  const isTransfer = action === 'send';
  const title = isAdd ? 'Wallet top up' : isTransfer ? 'Money sent' : `${serviceName} payment`;
  const detail = isAdd ? 'My linked bank account · Just now' : isTransfer ? `To ${account} · Just now` : `${serviceName} · ${account} · Just now`;
  state.transactions.unshift({
    title,
    detail,
    category: isAdd ? 'Income' : isTransfer ? 'Transfer' : 'Utilities',
    amount: isAdd ? amountInNaira : -amountInNaira,
    icon: isAdd ? 'arrow-down' : isTransfer ? 'arrow-up' : 'bolt',
    status: 'Success'
  });
  state.modal = null;
  state.tab = 'home';
  render();
  showToast(isAdd ? 'Money added to your wallet' : isTransfer ? 'Transfer successful' : 'Payment successful');
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.modal) {
    state.modal = null;
    render();
  }
});

render();
