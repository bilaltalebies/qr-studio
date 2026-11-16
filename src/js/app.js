import { CONTENT_TYPES, fieldsFor, buildPayload, validate, iconFor } from './content-types.js';
import { renderQR, downloadPNG, downloadSVG } from './qr.js';
import { getLang, setLang, t, initI18n } from './i18n.js';
import { initTheme, setTheme, loadHistory, saveHistory, clearHistory as clearHistoryStorage } from './storage.js';

const previewEl = document.getElementById('qrPreview');
const tabsEl = document.getElementById('typeTabs');
const fieldsEl = document.getElementById('fieldsContainer');
const metaTypeEl = document.getElementById('metaType');
const statusEl = document.getElementById('previewStatus');
const fgColorEl = document.getElementById('fgColor');
const bgColorEl = document.getElementById('bgColor');
const sizeSelectEl = document.getElementById('sizeSelect');
const historyListEl = document.getElementById('historyList');
const historyEmptyEl = document.getElementById('historyEmpty');

let currentType = 'url';
const valuesByType = {};
let hasQR = false;
let currentPayload = '';
let genTimer = null;
const settings = { fg: '#0f172a', bg: '#ffffff', size: 256 };
let history = [];

function currentValues() {
  if (!valuesByType[currentType]) valuesByType[currentType] = {};
  return valuesByType[currentType];
}

function renderTabs() {
  tabsEl.innerHTML = '';
  CONTENT_TYPES.forEach((ct, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'type-tab' + (ct.id === currentType ? ' is-active' : '');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', String(ct.id === currentType));
    btn.setAttribute('tabindex', ct.id === currentType ? '0' : '-1');
    btn.dataset.type = ct.id;
    const label = document.createElement('span');
    label.setAttribute('data-i18n', `type_${ct.id}`);
    label.textContent = t(`type_${ct.id}`);
    btn.innerHTML = iconFor(ct.id) + ' ';
    btn.appendChild(label);
    btn.addEventListener('click', () => switchType(ct.id));
    btn.addEventListener('keydown', (e) => {
      const tabs = Array.from(tabsEl.querySelectorAll('.type-tab'));
      const i = tabs.indexOf(btn);
      let nextIndex = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIndex = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIndex = (i - 1 + tabs.length) % tabs.length;
      if (nextIndex >= 0) {
        e.preventDefault();
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      }
    });
    tabsEl.appendChild(btn);
  });
}

function renderFields() {
  const values = currentValues();
  fieldsEl.innerHTML = '';
  fieldsFor(currentType).forEach((f) => {
    const field = document.createElement('div');
    field.className = 'field';

    if (f.inputType === 'checkbox') {
      const wrap = document.createElement('label');
      wrap.className = 'checkbox-field';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = `field_${f.name}`;
      input.name = f.name;
      if (values[f.name]) input.checked = true;
      const span = document.createElement('span');
      span.setAttribute('data-i18n', f.labelKey);
      span.textContent = t(f.labelKey);
      wrap.appendChild(input);
      wrap.appendChild(span);
      field.appendChild(wrap);
      values[f.name] = !!values[f.name];
      input.addEventListener('change', () => {
        values[f.name] = input.checked;
        scheduleGenerate();
      });
      fieldsEl.appendChild(field);
      return;
    }

    const label = document.createElement('label');
    label.setAttribute('for', `field_${f.name}`);
    label.setAttribute('data-i18n', f.labelKey);
    label.textContent = t(f.labelKey);
    field.appendChild(label);

    let input;
    if (f.inputType === 'textarea') {
      input = document.createElement('textarea');
    } else if (f.inputType === 'select') {
      input = document.createElement('select');
      (f.options || []).forEach((o) => {
        const opt = document.createElement('option');
        opt.value = o.value;
        opt.setAttribute('data-i18n', o.labelKey);
        opt.textContent = t(o.labelKey);
        if (values[f.name] === o.value) opt.selected = true;
        input.appendChild(opt);
      });
    } else {
      input = document.createElement('input');
      input.type = f.inputType;
    }
    input.id = `field_${f.name}`;
    input.name = f.name;
    if (f.placeholderKey) {
      input.setAttribute('data-i18n-placeholder', f.placeholderKey);
      input.placeholder = t(f.placeholderKey);
    }
    if (f.required) input.required = true;

    if (f.inputType === 'select') {
      if (values[f.name] === undefined && input.options.length) {
        values[f.name] = input.options[0].value;
      }
      if (values[f.name] !== undefined) input.value = values[f.name];
    } else if (values[f.name] !== undefined) {
      input.value = values[f.name];
    }

    const handler = () => {
      values[f.name] = input.value;
      scheduleGenerate();
    };
    input.addEventListener('input', handler);
    if (f.inputType === 'select') input.addEventListener('change', handler);
    field.appendChild(input);
    fieldsEl.appendChild(field);
  });
}

function switchType(type) {
  currentType = type;
  renderTabs();
  renderFields();
  updateMetaType();
}

function updateMetaType() {
  metaTypeEl.textContent = t(`type_${currentType}`);
}

function setStatus(msg) {
  statusEl.textContent = msg || '';
}

function updateDownloadButtons() {
  const disabled = !hasQR || !currentPayload;
  document.getElementById('downloadBtn').disabled = disabled;
  document.getElementById('downloadSvgBtn').disabled = disabled;
}

function doGenerate(silent = false, saveToHistory = false) {
  const values = currentValues();
  if (!validate(currentType, values)) {
    if (!silent) toast(t('toast_invalid'));
    setStatus(t('toast_invalid'));
    return;
  }
  const payload = buildPayload(currentType, values);
  const result = renderQR(previewEl, payload, settings);
  if (result.ok) {
    hasQR = true;
    currentPayload = payload;
    setStatus('');
    if (!silent) toast(t('toast_generated'));
    if (saveToHistory) {
      pushHistory(currentType, payload, values);
      renderHistory();
    }
    updateDownloadButtons();
  } else {
    hasQR = false;
    currentPayload = '';
    previewEl.innerHTML = placeholderHtml();
    const msg = t('toast_tooLong');
    setStatus(msg);
    if (!silent) toast(msg);
    updateDownloadButtons();
  }
  updateMetaType();
}

function scheduleGenerate() {
  clearTimeout(genTimer);
  genTimer = setTimeout(() => doGenerate(true, false), 450);
}

function clearAll() {
  const values = currentValues();
  Object.keys(values).forEach((k) => delete values[k]);
  renderFields();
  previewEl.innerHTML = placeholderHtml();
  hasQR = false;
  currentPayload = '';
  setStatus('');
  updateDownloadButtons();
  toast(t('toast_cleared'));
}

function placeholderHtml() {
  return `<div class="qr-placeholder">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.2"/>
      <rect x="14" y="3" width="7" height="7" rx="1.2"/>
      <rect x="3" y="14" width="7" height="7" rx="1.2"/>
      <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 21h3M21 14v3"/>
    </svg>
    <div data-i18n="emptyPreview">${t('emptyPreview')}</div>
  </div>`;
}

let toastTimer = null;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 2200);
}

function updateThemeUI() {
  const theme = document.documentElement.getAttribute('data-theme');
  const label = document.getElementById('themeLabel');
  label.setAttribute('data-i18n', theme === 'dark' ? 'themeLight' : 'themeDark');
  label.textContent = t(theme === 'dark' ? 'themeLight' : 'themeDark');
}

function updateLangUI() {
  document.getElementById('langLabel').textContent = getLang().toUpperCase();
}

function pushHistory(type, payload, values) {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    content: payload,
    values: values || {},
    settings: { fg: settings.fg, bg: settings.bg, size: settings.size },
    createdAt: new Date().toISOString(),
  };
  history.unshift(entry);
  history = history.slice(0, 10);
  saveHistory(history);
}

function renderHistory() {
  historyListEl.innerHTML = '';
  if (!history || history.length === 0) {
    historyEmptyEl.style.display = '';
    return;
  }
  historyEmptyEl.style.display = 'none';
  history.forEach((entry) => {
    const item = document.createElement('div');
    item.className = 'history-item';

    const thumb = document.createElement('div');
    thumb.className = 'history-thumb';
    renderQR(thumb, entry.content, {
      fg: entry.settings.fg,
      bg: entry.settings.bg,
      size: 56,
    });

    const meta = document.createElement('div');
    meta.className = 'history-meta';
    const typeEl = document.createElement('div');
    typeEl.className = 'history-type';
    typeEl.textContent = t(`type_${entry.type}`);
    const contentEl = document.createElement('div');
    contentEl.className = 'history-content';
    contentEl.textContent = entry.content;
    const dateEl = document.createElement('div');
    dateEl.className = 'history-date';
    try {
      dateEl.textContent = new Date(entry.createdAt).toLocaleString(getLang() === 'ar' ? 'ar' : 'en');
    } catch (e) {
      dateEl.textContent = entry.createdAt;
    }
    meta.appendChild(typeEl);
    meta.appendChild(contentEl);
    meta.appendChild(dateEl);

    const actions = document.createElement('div');
    actions.className = 'history-actions';
    const regenBtn = document.createElement('button');
    regenBtn.type = 'button';
    regenBtn.className = 'btn btn-ghost';
    regenBtn.setAttribute('data-i18n', 'regenerate');
    regenBtn.textContent = t('regenerate');
    regenBtn.addEventListener('click', () => regenerateEntry(entry));
    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn btn-ghost';
    delBtn.setAttribute('data-i18n', 'deleteEntry');
    delBtn.textContent = t('deleteEntry');
    delBtn.addEventListener('click', () => deleteEntry(entry.id));
    actions.appendChild(regenBtn);
    actions.appendChild(delBtn);

    item.appendChild(thumb);
    item.appendChild(meta);
    item.appendChild(actions);
    historyListEl.appendChild(item);
  });
}

function regenerateEntry(entry) {
  currentType = entry.type;
  valuesByType[entry.type] = { ...(entry.values || {}) };
  settings.fg = entry.settings.fg || settings.fg;
  settings.bg = entry.settings.bg || settings.bg;
  settings.size = entry.settings.size || settings.size;
  fgColorEl.value = settings.fg;
  bgColorEl.value = settings.bg;
  sizeSelectEl.value = String(settings.size);

  renderTabs();
  renderFields();
  updateMetaType();
  const result = renderQR(previewEl, entry.content, settings);
  if (result.ok) {
    hasQR = true;
    currentPayload = entry.content;
    setStatus('');
    updateDownloadButtons();
    toast(t('toast_regenerated'));
  } else {
    hasQR = false;
    currentPayload = '';
    previewEl.innerHTML = placeholderHtml();
    setStatus(t('toast_tooLong'));
    toast(t('toast_tooLong'));
    updateDownloadButtons();
  }
}

function deleteEntry(id) {
  history = history.filter((e) => e.id !== id);
  saveHistory(history);
  renderHistory();
  toast(t('toast_deleted'));
}

// Wiring
document.getElementById('contentForm').addEventListener('submit', (e) => {
  e.preventDefault();
  doGenerate(false, true);
});
document.getElementById('clearBtn').addEventListener('click', clearAll);
document.getElementById('downloadBtn').addEventListener('click', () => {
  if (!hasQR || !currentPayload) { toast(t('toast_noqr')); return; }
  const ok = downloadPNG(previewEl);
  if (ok) toast(t('toast_downloaded'));
  else toast(t('toast_noqr'));
});
document.getElementById('downloadSvgBtn').addEventListener('click', () => {
  if (!hasQR || !currentPayload) { toast(t('toast_noqr')); return; }
  const ok = downloadSVG(currentPayload, settings);
  if (ok) toast(t('toast_downloaded'));
  else toast(t('toast_noqr'));
});

document.getElementById('themeToggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  updateThemeUI();
});

document.getElementById('langToggle').addEventListener('click', () => {
  setLang(getLang() === 'en' ? 'ar' : 'en');
  updateLangUI();
  updateThemeUI();
  renderTabs();
  renderFields();
  updateMetaType();
  renderHistory();
});

fgColorEl.addEventListener('input', () => {
  settings.fg = fgColorEl.value;
  if (hasQR) doGenerate(true, false);
});
bgColorEl.addEventListener('input', () => {
  settings.bg = bgColorEl.value;
  if (hasQR) doGenerate(true, false);
});
sizeSelectEl.addEventListener('change', () => {
  settings.size = Number(sizeSelectEl.value);
  if (hasQR) doGenerate(true, false);
});

document.getElementById('clearHistoryBtn').addEventListener('click', () => {
  clearHistoryStorage();
  history = [];
  renderHistory();
  toast(t('toast_historyCleared'));
});

// Init
initTheme();
initI18n();
settings.fg = fgColorEl.value || settings.fg;
settings.bg = bgColorEl.value || settings.bg;
settings.size = Number(sizeSelectEl.value) || settings.size;
history = loadHistory();

updateLangUI();
updateThemeUI();
renderTabs();
renderFields();
updateMetaType();
updateDownloadButtons();
renderHistory();
