# QR Studio

A lightweight, production-oriented QR code generator that runs entirely in the browser. No backend, no tracking — all user content stays local via `localStorage`.

## Features (V1)

- Content types: URL, Plain text, Wi-Fi, Email, Phone
- Dedicated QR preview area
- Light and dark themes (persisted)
- English and Arabic with RTL layout (persisted)
- Responsive desktop / tablet / mobile layouts
- QR color customization
- QR size selection (256, 512, 1024)
- PNG and SVG export
- Recent QR history (last 10, local only)
- Accessible controls and status announcements

## Project structure

```
QR Studio/
├── index.html
├── src/
│   ├── css/
│   │   ├── tokens.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   └── components.css
│   └── js/
│       ├── app.js
│       ├── content-types.js
│       ├── i18n.js
│       ├── qr.js
│       └── storage.js
├── vendor/
│   └── qrcode-generator.min.js
└── README.md
```

## Running

Serve the folder with any static HTTP server (ES modules require HTTP, not `file://`):

```bash
python -m http.server 8080
```

Then open http://localhost:8080.

## Notes

- QR generation uses the vendored `qrcode-generator` library.
- Theme, language, and recent history are stored in `localStorage` under `qrstudio.theme`, `qrstudio.lang`, and `qrstudio.history`.
- No user-generated content is transmitted externally.
