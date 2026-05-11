src/
├── assets/
├── components/       ← reusable UI (Button, Modal, Card…)
├── context/          ← AuthContext, ThemeContext…
├── features/
│   ├── Wedding/
│   ├── Guests/
│   ├── Invitation/
│   ├── RSVP/
│   ├── Budget/
│   └── Gifts/
├── hooks/            ← useAuth, useGuests…
├── layout/           ← Navbar, Sidebar, Footer
├── pages/
│   ├── Auth/
│   ├── Dashboard/
│   └── Home/
├── redux/            ← store.js, slices/
├── services/         ← api.js, authService.js…
├── utils/            ← formatDate, formatCurrency…
├── App.jsx
├── index.css
└── main.jsx