// Content type definitions and payload builders
export const CONTENT_TYPES = [
  { id: 'url' },
  { id: 'text' },
  { id: 'wifi' },
  { id: 'email' },
  { id: 'phone' },
];

export function iconFor(type) {
  // Returns a small inline svg string keyed by type
  const icons = {
    url: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    text: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
    wifi: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1"/></svg>',
    email: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 5L2 7"/></svg>',
    phone: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  };
  return icons[type] || '';
}

export function fieldsFor(type) {
  switch (type) {
    case 'url':
      return [{ name: 'url', inputType: 'url', required: true, labelKey: 'field_url', placeholderKey: 'ph_url' }];
    case 'text':
      return [{ name: 'text', inputType: 'textarea', required: true, labelKey: 'field_text', placeholderKey: 'ph_text' }];
    case 'wifi':
      return [
        { name: 'ssid', inputType: 'text', required: true, labelKey: 'field_ssid', placeholderKey: 'ph_ssid' },
        { name: 'password', inputType: 'password', required: false, labelKey: 'field_password', placeholderKey: 'ph_password' },
        { name: 'security', inputType: 'select', required: true, labelKey: 'field_security', options: [
          { value: 'WPA', labelKey: 'opt_wpa' },
          { value: 'WEP', labelKey: 'opt_wep' },
          { value: 'nopass', labelKey: 'opt_nopass' },
        ] },
        { name: 'hidden', inputType: 'checkbox', required: false, labelKey: 'field_hidden' },
      ];
    case 'email':
      return [
        { name: 'email', inputType: 'email', required: true, labelKey: 'field_email', placeholderKey: 'ph_email' },
        { name: 'subject', inputType: 'text', required: false, labelKey: 'field_subject', placeholderKey: 'ph_subject' },
        { name: 'body', inputType: 'textarea', required: false, labelKey: 'field_body', placeholderKey: 'ph_body' },
      ];
    case 'phone':
      return [{ name: 'phone', inputType: 'tel', required: true, labelKey: 'field_phone', placeholderKey: 'ph_phone' }];
    default:
      return [];
  }
}

function escapeWifi(s) {
  return String(s).replace(/([\\;,:"'])/g, '\\$1');
}

export function buildPayload(type, values) {
  switch (type) {
    case 'url':
      return (values.url || '').trim();
    case 'text':
      return values.text || '';
    case 'wifi': {
      const ssid = (values.ssid || '').trim();
      const pass = values.password || '';
      const sec = values.security || 'WPA';
      const hidden = values.hidden ? 'true' : 'false';
      return `WIFI:T:${sec};S:${escapeWifi(ssid)};P:${escapeWifi(pass)};H:${hidden};;`;
    }
    case 'email': {
      const to = (values.email || '').trim();
      const params = [];
      if (values.subject) params.push('subject=' + encodeURIComponent(values.subject));
      if (values.body) params.push('body=' + encodeURIComponent(values.body));
      const q = params.length ? '?' + params.join('&') : '';
      return `mailto:${to}${q}`;
    }
    case 'phone':
      return `tel:${(values.phone || '').trim()}`;
    default:
      return '';
  }
}

export function validate(type, values) {
  switch (type) {
    case 'url': return !!(values.url && values.url.trim());
    case 'text': return !!(values.text && values.text.trim());
    case 'wifi': return !!(values.ssid && values.ssid.trim());
    case 'email': return !!(values.email && values.email.trim());
    case 'phone': return !!(values.phone && values.phone.trim());
    default: return true;
  }
}

export function typeLabelKey(type) {
  return `type_${type}`;
}
