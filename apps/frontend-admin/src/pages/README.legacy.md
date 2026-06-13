# Legacy Admin Pages

The active admin route tree is defined in `src/App.jsx` and uses pages under
`src/features/**`.

Files in this folder are older admin screens kept temporarily for reference.
They are not mounted by the active router. Shared services should still use the
current `/api/v1/admin/**` route family when these files are referenced.
