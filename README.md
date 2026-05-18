# Koupreng Invitation Project

Koupreng Invitation Project is a wedding planning and digital invitation web application. The project contains a user-facing React app, an admin React app, reusable invitation templates, event creation tools, and helper scripts for Git workflow.

## Project Structure

```txt
Koupreng-invitation_project
├── frontend-user/      # Main user website and host dashboard
├── frontend-admin/     # Admin frontend app
├── runGit/             # Git helper scripts for push and pull
├── supabase/           # Supabase local/project configuration if used
├── restore.git.md      # Git restore notes
└── README.md           # Project documentation
```

## Tech Stack

- **Frontend:** React 19
- **Build tool:** Vite
- **Routing:** React Router
- **Animation:** Framer Motion, Lenis, Anime.js
- **Styling:** CSS, Tailwind CSS setup
- **Backend service:** Supabase client is configured in the frontend apps
- **Package manager:** npm

## Main User App

The main app is in:

```txt
frontend-user/
```

Important folders:

```txt
frontend-user/src
├── app/                # App shell, router, auth/theme providers
├── assets/             # Images, icons, fonts
├── features/           # Feature modules
├── layouts/            # Marketing, auth, host, admin layouts
├── pages/              # Page wrappers
├── shared/             # Shared API, hooks, services, UI components
└── main.jsx            # React entry point
```

Key template files:

```txt
frontend-user/src/features/templates
├── TemplatesGallery.jsx    # Template listing page UI
├── templatesData.js        # Template metadata and image paths
├── ClassicPreview.jsx      # Template detail/phone preview page
├── PreviewWedding.jsx      # Full wedding invitation preview page
├── RoyalInvitation.jsx     # Invitation UI renderer
├── TemplatesPage.css       # Gallery styles
├── DemoPage.css            # Preview/invitation styles
└── useCountdown.js         # Countdown hook
```

Template images are served from:

```txt
frontend-user/public/image
├── a1.png
├── a2.png
├── a3.png
├── a4.png
├── a5.png
├── a6.png
└── a7.png
```

## Main Routes

User/marketing routes:

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/pricing` | Pricing page |
| `/venues` | Venues page |
| `/templates` | Template gallery |
| `/templates/:id` | Template detail preview |
| `/templates/:id/preview` | Full invitation preview |
| `/login` | Login page |
| `/register` | Register page |
| `/forgot-password` | Forgot password page |

Host/dashboard routes:

| Route | Purpose |
| --- | --- |
| `/events` | Event list |
| `/events/create` | Create event form |
| `/events/create?template=classic` | Create event with a selected template |
| `/dashboard` | Host dashboard |
| `/guests` | Guest management |
| `/expenses` | Expense management |
| `/gifts` | Wedding gift page |
| `/add-template` | Add template page |

Admin routes:

| Route | Purpose |
| --- | --- |
| `/admin/dashboard` | Admin dashboard |
| `/admin/users` | User management |
| `/admin/templates` | Template management |
| `/admin/subscriptions` | Subscription placeholder |
| `/admin/venues` | Venue placeholder |
| `/admin/transactions` | Transaction placeholder |
| `/admin/logs` | System logs placeholder |

## Template Flow

Template user flow:

```txt
/templates
→ click មើលលម្អិត
→ /templates/:id
→ click មើលការអញ្ជើញពេញលេញ
→ /templates/:id/preview
```

Create event from template flow:

```txt
/templates
→ click ប្រើប្រាស់គំរូនេះ
→ /events/create?template=:id
```

When a template id is present in the URL, `CreateEventForm` opens the event details form directly instead of forcing the user to choose a theme first.

## Setup

Install dependencies for the user app:

```bash
cd frontend-user
npm install
```

Install dependencies for the admin app:

```bash
cd frontend-admin
npm install
```

## Development

Run the user app:

```bash
cd frontend-user
npm run dev
```

Default Vite URL:

```txt
http://localhost:5173
```

Run the admin app:

```bash
cd frontend-admin
npm run dev
```

If both apps are running at the same time, Vite may assign the second app another port.

## Build

Build the user app:

```bash
cd frontend-user
npm run build
```

Build the admin app:

```bash
cd frontend-admin
npm run build
```

Preview production build:

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

Run this inside either `frontend-user` or `frontend-admin`.

## Environment Variables

Environment files are ignored by Git:

```txt
.env
.env.*
```

Use `.env.example` as the safe committed template. Do not commit real Supabase keys or other secrets.

## Git Helper Scripts

Git helper scripts are in:

```txt
runGit/
├── git-push.sh
├── git-pull.sh
├── git-push.bat
└── git-pull.bat
```

Linux/macOS/Git Bash push:

```bash
./runGit/git-push.sh "your commit message"
```

Linux/macOS/Git Bash pull:

```bash
./runGit/git-pull.sh
```

The shell scripts automatically run from the repository root, even if launched from inside `runGit`.

Windows push:

```bat
runGit\git-push.bat
```

Windows pull:

```bat
runGit\git-pull.bat
```

## Git Push Script Behavior

`git-push.sh` does this:

```txt
status
→ stage all changes
→ commit
→ pull --rebase
→ push
```

It also detects untracked files before committing.

## Git Pull Script Behavior

`git-pull.sh` does this:

```txt
status
→ stash local changes including untracked files
→ pull
→ restore stash
```

If conflicts happen, the script stops and prints the commands needed to continue or abort.

## Notes

- `node_modules/` and `dist/` should not be committed.
- Keep real secrets out of `.env` files committed to Git.
- Template gallery images should live in `frontend-user/public/image` and use paths like `/image/a1.png`.
- The current main branch remote is GitHub: `Nha0325/Koupreng-invitation_project`.
