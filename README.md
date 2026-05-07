---

## 🖥️ System Info

![System Info](./frontend/public/neofetch.svg)
---

#  Koupreng Invitation Project

![GitHub repo size](https://img.shields.io/github/repo-size/Nha0325/Koupreng-invitation_project?color=blue)
![GitHub last commit](https://img.shields.io/github/last-commit/Nha0325/Koupreng-invitation_project?color=green)
![GitHub stars](https://img.shields.io/github/stars/Nha0325/Koupreng-invitation_project?color=yellow)


## 🔐 SSH Key Setup

### ១. បង្កើត SSH Key

```bash
ssh-keygen -t ed25519 -C "your@email.com"
```

បង្កើត key ២ ប្រភេទ:

| File | Description |
|------|-------------|
| `~/.ssh/id_ed25519` | 🔒 Private key — **កុំចែករំលែក!** |
| `~/.ssh/id_ed25519.pub` | 🌐 Public key — ដាក់ GitHub |

---

### ២. Copy Public Key ទៅ GitHub

```
ssh-ed25519 AAAAC3NzaC1J37KXGRvKJVGtz your@email.com
```

🔗 Go to: [https://github.com/settings/keys](https://github.com/settings/keys)

> GitHub Settings → SSH Keys → **"ThinkPad T470p"** or **"My Laptop"**

---

### ៣. Test Connection

```bash
ssh -T git@github.com
```

✅ GitHub បានឆ្លើយ: **"Hi Nha0325!"**

---

### ៤. Push Code

```bash
git push -u origin main
```

✅ Code ទៅដល់ GitHub ជោគជ័យ

---

## 🚀 Git Workflow — Every Time You Write Code

```bash
git add . && git commit -m "your message here" && git push
```

> 💡 No password needed — SSH handles it automatically!

---

## 🎨 Run Tailwind CSS

```bash
npx @tailwindcss/cli \
  -i ./src/assets/style/input.css \
  -o ./src/assets/style/output.css \
  --watch
```

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=javascript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
