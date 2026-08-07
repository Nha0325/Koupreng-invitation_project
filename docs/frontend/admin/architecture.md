# Frontend admin architecture

The admin application has one router in `src/app/App.jsx`, one auth provider, one admin guard, one shared Axios client in `src/shared/api/adminHttpClient.js`, and one toast implementation under `src/shared/ui/`. Route-level wrappers under `src/pages/<domain>/` compose the active feature pages. The flat `src/pages/EventsPage.jsx` remains intentionally routed until it receives a domain replacement.

The active route contract is centralized in `src/app/routes.js` and protected by unit tests. Legacy `src/legacy/`, flat duplicate pages, unused notification code, and their private services were removed after import-graph and route verification.
