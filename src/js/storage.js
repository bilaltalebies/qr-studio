// LocalStorage helpers
const THEME_KEY = 'qrstudio.theme';

export function getTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (e) {}
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function setTheme(theme) {
  if (theme !== 'light' && theme !== 'dark') return;
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  document.documentElement.setAttribute('data-theme', theme);
}

export function initTheme() {
  setTheme(getTheme());
}

const HISTORY_KEY = 'qrstudio.history';
const MAX_HISTORY = 10;

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_HISTORY);
  } catch (e) {
    return [];
  }
}

export function saveHistory(list) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, MAX_HISTORY)));
    return true;
  } catch (e) {
    return false;
  }
}

export function clearHistory() {
  try { localStorage.removeItem(HISTORY_KEY); } catch (e) {}
}
