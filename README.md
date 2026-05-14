# Koupreng Invitation Project

![GitHub repo size](https://img.shields.io/github/repo-size/Nha0325/Koupreng-invitation_project?color=blue)
![GitHub last commit](https://img.shields.io/github/last-commit/Nha0325/Koupreng-invitation_project?color=green)
![GitHub stars](https://img.shields.io/github/stars/Nha0325/Koupreng-invitation_project?color=yellow)

## 🔐 SSH Key Setup

### ១. បង្កើត SSH Key — open terminal or Ctrl + J

```bash
ssh-keygen -t ed25519 -C "selenagamingti2@gmail.com" -f ~/.ssh/id_ed25519_selena -N ""
```

> 💡 ប្រើ flag `-f` ដើម្បីដាក់ឈ្មោះ key file ផ្ទាល់ (មិន overwrite key ចាស់) និង `-N ""` ដើម្បីមិនកំណត់ passphrase។

មើល public key:

```bash
cat ~/.ssh/id_ed25519_selena.pub
```

លទ្ធផល:

```
ssh-ed25519 AAAA************************************ selenagamingti2@gmail.com
```

បង្កើត key ២ ប្រភេទ:

| File                           | Description                       |
| ------------------------------ | --------------------------------- |
| `~/.ssh/id_ed25519_selena`     | 🔒 Private key — **កុំចែករំលែក!** |
| `~/.ssh/id_ed25519_selena.pub` | 🌐 Public key — ដាក់ GitHub       |

---

### ២. កំណត់ SSH config ឲ្យ GitHub ប្រើ key នេះ

បង្កើត ឬ កែ `~/.ssh/config`:

```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_selena
    IdentitiesOnly yes
```

Set permission:

```bash
chmod 600 ~/.ssh/config
```

---

### ៣. Copy Public Key ទៅ GitHub

```
ssh-ed25519 AAAAC3NzaC1************************ selenagamingti2@gmail.com
```

🔗 Go to: [https://github.com/settings/keys](https://github.com/settings/keys)

> GitHub Settings → SSH Keys → **New SSH key** → ដាក់ឈ្មោះ ឧទាហរណ៍ **"ThinkPad T470p"**

---

### ៤. កំណត់ Git user email

```bash
git config user.email "selenagamingti2@gmail.com"
```

---

### ៥. Test Connection

```bash
ssh -T git@github.com
```

✅ GitHub បានឆ្លើយ: **"Hi Nha0325! You've successfully authenticated, but GitHub does not provide shell access."**

---

### ៦. Push Code

```bash
git push -u origin main
```

✅ Code ទៅដល់ GitHub ជោគជ័យ

---

## 🚀 Git Workflow — Every Time You Write Code

```bash
git add . && git commit -m "Debug all Frontend pages." && git push -u origin main
```

> 💡 No password needed — SSH handles it automatically!

---

## 🎨 Run Tailwind CSS

```bash
npx @tailwindcss/cli -i ./src/assets/style/input.css -o ./src/assets/style/output.css --watch
```

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-007ACC?style=for-the-badge&logo=javascript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
