// Internationalization (English / Arabic)
const STORAGE_KEY = 'qrstudio.lang';

const translations = {
  en: {
    brand: 'QR Studio',
    tagline: 'Instant QR codes, fully in your browser.',
    heroTitle: 'Generate QR codes instantly',
    heroSubtitle: 'Create QR codes for links, text, Wi-Fi, email and phone numbers. Everything stays local to your browser — no backend, no tracking.',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    language: 'Language',
    contentType: 'Content type',
    generate: 'Generate',
    clear: 'Clear',
    download: 'Download PNG',
    previewTitle: 'QR Preview',
    previewSubtitle: 'Your generated code appears here',
    emptyPreview: 'Enter content and generate a QR code',
    emptyHint: 'Your data never leaves this device',
    type_url: 'URL',
    type_text: 'Text',
    type_wifi: 'Wi-Fi',
    type_email: 'Email',
    type_phone: 'Phone',
    field_url: 'URL',
    ph_url: 'https://example.com',
    field_text: 'Text',
    ph_text: 'Enter your text here',
    field_ssid: 'Network name (SSID)',
    ph_ssid: 'My Wi-Fi',
    field_password: 'Password',
    ph_password: 'Network password',
    field_security: 'Security',
    opt_wpa: 'WPA/WPA2',
    opt_wep: 'WEP',
    opt_nopass: 'None',
    field_hidden: 'Hidden network',
    field_email: 'Email address',
    ph_email: 'name@example.com',
    field_subject: 'Subject',
    ph_subject: 'Optional subject',
    field_body: 'Message',
    ph_body: 'Optional message',
    field_phone: 'Phone number',
    ph_phone: '+1 555 123 4567',
    toast_generated: 'QR code generated',
    toast_cleared: 'Cleared',
    toast_downloaded: 'Downloaded',
    toast_noqr: 'Generate a QR code first',
    toast_invalid: 'Please fill in the required fields',
    footer: 'QR Studio — runs entirely in your browser.',
    meta_type: 'Type',
    meta_size: 'Size',
    size_value: '256 × 256 px',
    fgColor: 'Foreground color',
    bgColor: 'Background color',
    qrSize: 'QR size',
    size_256: '256 × 256',
    size_512: '512 × 512',
    size_1024: '1024 × 1024',
    downloadPng: 'Download PNG',
    downloadSvg: 'Download SVG',
    historyTitle: 'Recent QR codes',
    historySubtitle: 'Last 10 generated codes, stored locally',
    clearHistory: 'Clear history',
    historyEmpty: 'No recent QR codes yet',
    regenerate: 'Regenerate',
    deleteEntry: 'Delete',
    toast_tooLong: 'Content is too long for a QR code',
    toast_saved: 'Saved to history',
    toast_regenerated: 'QR regenerated',
    toast_deleted: 'Deleted',
    toast_historyCleared: 'History cleared',
  },
  ar: {
    brand: 'استوديو QR',
    tagline: 'رموز QR فورية، بالكامل في متصفحك.',
    heroTitle: 'أنشئ رموز QR فوراً',
    heroSubtitle: 'أنشئ رموز QR للروابط والنصوص وشبكات Wi-Fi والبريد الإلكتروني وأرقام الهاتف. كل شيء يبقى محلياً في متصفحك — بدون خادم، بدون تتبع.',
    theme: 'المظهر',
    themeLight: 'فاتح',
    themeDark: 'داكن',
    language: 'اللغة',
    contentType: 'نوع المحتوى',
    generate: 'إنشاء',
    clear: 'مسح',
    download: 'تنزيل PNG',
    previewTitle: 'معاينة QR',
    previewSubtitle: 'يظهر رمزك المُنشأ هنا',
    emptyPreview: 'أدخل المحتوى وأنشئ رمز QR',
    emptyHint: 'بياناتك لا تغادر هذا الجهاز',
    type_url: 'رابط',
    type_text: 'نص',
    type_wifi: 'Wi-Fi',
    type_email: 'بريد إلكتروني',
    type_phone: 'هاتف',
    field_url: 'الرابط',
    ph_url: 'https://example.com',
    field_text: 'النص',
    ph_text: 'أدخل نصك هنا',
    field_ssid: 'اسم الشبكة (SSID)',
    ph_ssid: 'شبكتي',
    field_password: 'كلمة المرور',
    ph_password: 'كلمة مرور الشبكة',
    field_security: 'الأمان',
    opt_wpa: 'WPA/WPA2',
    opt_wep: 'WEP',
    opt_nopass: 'بلا',
    field_hidden: 'شبكة مخفية',
    field_email: 'عنوان البريد الإلكتروني',
    ph_email: 'name@example.com',
    field_subject: 'الموضوع',
    ph_subject: 'موضوع اختياري',
    field_body: 'الرسالة',
    ph_body: 'رسالة اختيارية',
    field_phone: 'رقم الهاتف',
    ph_phone: '+1 555 123 4567',
    toast_generated: 'تم إنشاء رمز QR',
    toast_cleared: 'تم المسح',
    toast_downloaded: 'تم التنزيل',
    toast_noqr: 'أنشئ رمز QR أولاً',
    toast_invalid: 'يرجى ملء الحقول المطلوبة',
    footer: 'استوديو QR — يعمل بالكامل في متصفحك.',
    meta_type: 'النوع',
    meta_size: 'الحجم',
    size_value: '256 × 256 px',
    fgColor: 'لون المقدمة',
    bgColor: 'لون الخلفية',
    qrSize: 'حجم QR',
    size_256: '256 × 256',
    size_512: '512 × 512',
    size_1024: '1024 × 1024',
    downloadPng: 'تنزيل PNG',
    downloadSvg: 'تنزيل SVG',
    historyTitle: 'رموز QR الأخيرة',
    historySubtitle: 'آخر 10 رموز منشأة، محفوظة محلياً',
    clearHistory: 'مسح السجل',
    historyEmpty: 'لا توجد رموز QR حديثة',
    regenerate: 'إعادة إنشاء',
    deleteEntry: 'حذف',
    toast_tooLong: 'المحتوى طويل جداً لرمز QR',
    toast_saved: 'تم الحفظ في السجل',
    toast_regenerated: 'تم إعادة إنشاء QR',
    toast_deleted: 'تم الحذف',
    toast_historyCleared: 'تم مسح السجل',
  },
};

let currentLang = 'en';
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'en' || saved === 'ar') currentLang = saved;
} catch (e) {}

export function getLang() { return currentLang; }

export function setLang(lang) {
  if (lang !== 'en' && lang !== 'ar') return;
  currentLang = lang;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  applyTranslations();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}

export function t(key) {
  const dict = translations[currentLang] || translations.en;
  return dict[key] !== undefined ? dict[key] : (translations.en[key] !== undefined ? translations.en[key] : key);
}

export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.setAttribute('placeholder', t(key));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    el.setAttribute('aria-label', t(key));
  });
}

export function initI18n() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  applyTranslations();
}
