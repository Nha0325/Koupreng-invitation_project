# 💌 Koupreng — Khmer Wedding Invitation Platform

កម្មវិធី​បង្កើត​ការ​អញ្ជើញ​មង្គល​ការ​បែប​ឌី​ជី​ថល ​សម្រាប់​​ប្រជា​ជន​ខ្មែរ ​​​​​​​​​​​​​មាន template រាជ​វង្ស​​ ​​ទំនើប ការ​​ជ្រើស​ពណ៌ Dress Code, RSVP, Background Music, និង ​Live Phone Preview។

> 🎬 ​មាន​​​ Wedding video intro 3 ​វិនាទី​ មុន​បង្ហាញ​ការ​អញ្ជើញ​ ​ដូច​ការ​បើក​សំបុត្រ​ពិត​ៗ។

---

## 📦 Project Structure

```
Koupreng-invitation_project/
├── frontend-user/        ← User-facing site (React + Vite)
├── frontend-admin/       ← Admin dashboard
├── backend/              ← Spring Boot API (Java 25)
├── supabase/             ← Database migrations & auth
├── scripts/              ← Git helper scripts (team workflow)
└── README.md             ← អ្នក​​​កំពុង​​អាន​​ឯកសារ​នេះ
```

---

## ✨ Features

### 🎨 Wedding Builder (6 Steps)
1. **ជ្រើស​​​ template** — Royal, Modern Garden, Forest Luxury, Vintage Gold ​ល​
2. **ព័ត៌​មាន​គូរ** — ឈ្មោះ​កូន​កំ​លោះ និង​​​កូន​ក្រ​មុំ
3. **ព័ត៌​មាន​ពិធី** — កាល​បរិច្ឆេទ ​ ម៉ោង ទីកន្លែង Dress Code និង​ Music
4. **រឿង / រូប​ភាព** — Upload រូប​ភាព និង វីដេអូ
5. **​ការ​​​​កំណត់ RSVP** — បើក/​បិទ ​​​​​ ​កំណត់​ deadline
6. **ត្រួត​ពិនិត្យ​ និង​បោះ​ផ្សាយ** — បង្កើត URL ផ្ទាល់​ខ្លួន

### 🛠️ Components ​សំខាន់​ៗ

- 📅 **DatePicker** — Calendar ​ខ្មែរ​​ ​​​​​​​​មាន​ឈ្មោះ​ខែ​ខ្មែរ
- ⏰ **TimePicker** — 12-hour ​​​​ខ្មែរ (ព្រឹក/ល្ងាច)
- 📍 **VenuePicker** — Autocomplete ​សាល​មង្គល​ការ​​​​​​ ​ក្នុង 8 ​​​ខេត្ត​ (បាត់ដំបង, ភ្នំពេញ, សៀមរាប​​​ ​​​ល​)
- 🎨 **DressCodePicker** — 8 color combos ឬ​ pick ផ្ទាល់​ខ្លួន
- 🎵 **MusicPicker** — Background music សម្រាប់​ការ​អញ្ជើញ
- 🖼️ **Gallery Upload** — រូប​ភាព + វីដេអូ (រក្សា​ទុក​​ក្នុង IndexedDB)

### 🌐 Pages

| Path | មុខងារ |
|---|---|
| `/` | Marketing homepage |
| `/templates` | មើល​ template ទាំង​អស់ |
| `/templates/:id` | Template demo + phone preview |
| `/templates/:id/preview` | Full template preview |
| `/create/wedding/:draftId` | Wedding builder (6 steps) |
| `/preview/:draftId` | Preview draft |
| `/w/:slug` | Public published invitation |
| `/dashboard` | Host dashboard |

---

## 🚀 ​ការ​​ចាប់​ផ្ដើម​ (Getting Started)

### Prerequisites

- **Node.js** 20+ (សម្រាប់ frontend)
- **Java** 25 (សម្រាប់​ backend)
- **Maven** 3.9+
- **Git**

### 1. Clone Repository

```bash
git clone git@github.com:Nha0325/Koupreng-invitation_project.git
cd Koupreng-invitation_project
```

### 2. Frontend (User-facing)

```bash
cd frontend-user
npm install
cp .env.example .env.local
# Edit .env.local — បំពេញ Supabase keys
npm run dev
# → http://localhost:5173
```

### 3. Frontend (Admin)

```bash
cd frontend-admin
npm install
npm run dev
```

### 4. Backend (Spring Boot)

Use the safe team push script instead of running `git add && git commit && git push` manually.

Run this from the project folder in PowerShell:

```bash
<<<<<<< Updated upstream
cd backend
./mvnw spring-boot:run
# → http://localhost:8080
=======
.\git-push.ps1 "your commit message"
```

If PowerShell blocks the script because of execution policy, run:

```bash
powershell -ExecutionPolicy Bypass -File .\git-push.ps1 "your commit message"
```

If you do not pass a message, the script will ask for one in the terminal.

The script checks GitHub first, temporarily stashes uncommitted local work when it needs to pull collaborator code, applies the stash back, commits your current changes, and then pushes. If the same lines were changed by two people, it stops and asks you to resolve the conflict so nobody's code is overwritten automatically.

> 💡 No password needed — SSH handles it automatically!

---

## 🎨 Run Tailwind CSS

```bash
npx @tailwindcss/cli -i ./src/assets/style/input.css -o ./src/assets/style/output.css --watch
>>>>>>> Stashed changes
```

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ **React 19** + **Vite 8**
- 🌊 **Tailwind CSS v4**
- 🎬 **Framer Motion** + **Lenis** (smooth scroll)
- 🔐 **Supabase** (auth + storage)
- 📦 **IndexedDB** (gallery storage — ​​​​​​មិន​​មាន​​ limit ដូច localStorage)

### Backend
- ☕ **Spring Boot 4.0** + **Java 25**
- 💾 **Spring Data JPA**
- 🛡️ **Spring Security** (OAuth2 Resource Server + JWT)
- 🗄️ **PostgreSQL** (via Supabase)

### Infrastructure
- 🟢 **Supabase** — Database + Auth + Storage
- 🐙 **GitHub** — Code repository

---

## 🤝 Team Workflow

​​សម្រាប់​​ team ​ច្រើន​នាក់​ធ្វើ​ការ​ព្រម​គ្នា ​សូម​​ ​​​ប្រើ scripts ដើម្បី​ចៀស​​​​​​​ code ជាន់​គ្នា​៖

```bash
# រាល់​ពេល​ត្រូវ push
./scripts/git-safe.sh "your commit message"
```

មើល **[scripts/README.md](./scripts/README.md)** ​សម្រាប់​ documentation ពេញ​លេញ។

### ⚠️ ច្បាប់​សំខាន់

> 🔴 **BEFORE you write any new code or push anything to GitHub, you MUST pull the latest code!**
> If you push old code without pulling first, it will cause massive merge conflicts and break the new architecture.

---

## 📂 Frontend ​ Folder Structure

```
frontend-user/src/
├── app/                      ← Router setup
├── assets/                   ← Images, music, video
├── features/
│   ├── wedding-site/         ← RoyalInvitation component
│   ├── wedding-builder/      ← Builder steps + phone preview
│   ├── templates/            ← Templates data + grid
│   ├── events/               ← Events list & form
│   ├── dashboard/            ← Host dashboard
│   └── admin/                ← Admin overview
├── pages/                    ← Top-level pages
│   ├── marketing/            ← Homepage, Pricing, Venues
│   ├── auth/                 ← Login, Register, Forgot password
│   ├── host/                 ← Dashboard, Guests, Events
│   └── admin/                ← Admin dashboard
├── shared/
│   ├── ui/                   ← DatePicker, TimePicker, VenuePicker, DressCodePicker, MusicPicker
│   ├── data/                 ← venuesData, dressCodeColors, musicTracks
│   └── hooks/                ← useToggle, useScrollSpy
├── services/                 ← weddingStorage, galleryStorage (IndexedDB)
├── lib/                      ← supabase client
└── layouts/                  ← MarketingShell, HostShell, AuthShell
```

---

## 🔧 Environment Variables

`frontend-user/.env.local`:
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_API_BASE_URL=http://localhost:8080
```

---

## 🆘 Troubleshooting

| បញ្ហា | ដំណោះ​ស្រាយ |
|---|---|
| Git rebase/merge ​ជាប់ | `./scripts/git-recover.sh` |
| Code ជាន់​គ្នា​ពេល push | ប្រើ​ `./scripts/git-safe.sh` ​ជំនួស |
| `axios` not found | `cd frontend-user && npm install` |
| Vite port ច្រើន​ៗ | `pkill node` ឬ `npx kill-port 5173` |
| Supabase auth error | ពិនិត្យ `.env.local` mai មាន keys ត្រឹម​ត្រូវ |

---

## 📜 License

Private project — សម្រាប់ Koupreng team តែ​ប៉ុណ្ណោះ​។

---

## 👥 Team

- 🎨 Frontend Lead — Selena
- 💻 Backend — Vireak
- 🎯 Project Lead — Nha

---

## 🔗 Useful Links

- 📚 **[Scripts Documentation](./scripts/README.md)** — Git helper scripts
- 🎨 **[Frontend README](./frontend-user/README.md)** — Vite + React setup
- 🌐 **[Supabase Dashboard](https://supabase.com)** — Database & Auth
