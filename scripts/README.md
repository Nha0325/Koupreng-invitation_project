# 🤝 Git Helper Scripts — Team Safe Workflow

Scripts ងាយ​ៗ​សម្រាប់​​ pull និង push code ​ដោយ **មិន​ឱ្យ​ code ជាន់​គ្នា**​​ ​ពេល​ team ច្រើន​នាក់​ធ្វើ​ការ​ព្រម​គ្នា។

---

## ⚡ Quick Start

| ​​ស្ថាន​ភាព | Command | មុខងារ |
|---|---|---|
| 🌅 ​​ចាប់​ផ្ដើម​ថ្ងៃ​ ​​​​​​​​​​(pull តែ​ម្នាក់​ឯង) | `./scripts/git-pull.sh` | Sync team's code មុន​ចាប់ផ្ដើម​ធ្វើ​ការ |
| 🚀 ត្រៀម push code | `./scripts/git-safe.sh "your message"` | Pull → Commit → Push (safe) |
| 🆘 Git ​ជាប់ មិន​ដឹង​​​ធ្វើ​ម៉េច | `./scripts/git-recover.sh` | Abort ​​​rebase/merge ​​​ដែល​ជាប់ |

Windows: ​ប្រើ `.bat` ​​​ជំនួស​​ `.sh` (e.g. `scripts\git-pull.bat`)

---

## 📋 ​​​សារ​​​​ Team Leader

> 🔴 BEFORE you write any new code or push anything to GitHub, you MUST pull the latest code! If you push old code without pulling first, it will cause massive merge conflicts and break the new architecture.

Scripts ​ខាង​ក្រោម​​ធ្វើ​សារ​នេះ​​ស្វ័យ​ប្រវត្តិ ✅

---

## 🌅 `git-pull` — Pull តែ​មួយ​មុខងារ​

ប្រើ​ពេល **ចាប់​ផ្ដើម​ថ្ងៃ​ការ​ងារ​** ​ ឬ​ មុន​ពេល​​​​​ចាប់​ផ្ដើម​សរសេរ code ថ្មី។

### Run

**Linux / Mac / Git Bash:**
```bash
./scripts/git-pull.sh
```

**Windows:**
```bat
scripts\git-pull.bat
```

### វា​ធ្វើ​អ្វី?

```
[1] git status                                ← បង្ហាញ​ស្ថានភាព
[2] git stash push -u -m "before-pull-stash"  ← រក្សា​ uncommitted changes
[3] git pull origin <branch>                  ← ​ទាញ​ team's code
[4] git stash pop                             ← យក changes ​មក​វិញ
```

ជំហាន 2 និង 4 រំលង​ស្វ័យ​ប្រវត្តិ​បើ​មិន​មាន uncommitted changes។

---

## 🛡️ `git-safe` — Pull មុន​​​​​ Push

ប្រើ​ពេល​​ **​ត្រៀម push code** ​ ​​​ទៅ remote ​ដោយ​សុវត្ថិភាព​​ ​—​ pull មុន​​ ​​​​​​​​​​​​​​​​​​​​​បន្ទាប់​មក​ commit + push ​ដោយ​ស្វ័យ​ប្រវត្តិ​។

### Run

**Linux / Mac / Git Bash:**
```bash
./scripts/git-safe.sh                    # សួរ commit message
./scripts/git-safe.sh "fix login bug"    # ​​ផ្ដល់​​ message ផ្ទាល់
```

**Windows:**
```bat
scripts\git-safe.bat
scripts\git-safe.bat "fix login bug"
```

### វា​ធ្វើ​អ្វី?

```
[1] git status                                ← បង្ហាញ​ស្ថានភាព
[2] git stash push -u -m "before-pull-stash"  ← រក្សា​ uncommitted changes
[3] git pull origin <branch>                  ← ​ទាញ​ team's code មុន ⚠️
[4] git stash pop                             ← យក​ changes ​មក​វិញ
[5] git add .                                 ← Stage ឯកសារ​ទាំង​អស់
[6] git commit -m "<message>"                 ← Commit
[7] git push origin <branch>                  ← Push ​ទៅ​ remote
```

---

## 🆘 `git-recover` — ស្ដារ​ពេល git ជាប់

ប្រើ​ពេល rebase/merge/cherry-pick ​ជាប់​ ឬ​មាន error ​ប្លែក​ៗ។

### Run

**Linux / Mac:**
```bash
./scripts/git-recover.sh           # Abort gracefully
./scripts/git-recover.sh --hard    # Abort + លុប uncommitted changes
```

**Windows:**
```bat
scripts\git-recover.bat
scripts\git-recover.bat --hard
```

### វា​ធ្វើ​អ្វី?

1. Detect និង​ abort គ្រប់​ in-progress operations (rebase, merge, cherry-pick, revert)
2. បង្ហាញ​ **reflog** 15 entries ចុង​ក្រោយ​ — ​ស្វែង​រក commit ដែល​បាត់
3. ផ្ដល់​ command សម្រាប់​ស្ដារ commit ​បាត់

### ស្ដារ commit ​បាត់​ដោយ​ចៃ​ដន្យ

```
Recent reflog (last 15 entries):
abc1234 HEAD@{0}: rebase (abort): returning to refs/heads/main
def5678 HEAD@{1}: rebase (start): checkout origin/main
9ab0cde HEAD@{2}: commit: បន្ថែម login form    ← commit ​ដែល​បាត់
```

ស្ដារ​៖
```bash
git reset --hard 9ab0cde
```

---

## 🌿 ​Workflow ​ត្រឹម​ត្រូវ​​​ប្រចាំ​ថ្ងៃ​​សម្រាប់ Team

```bash
# ☀️ ពេល​ព្រឹក​ — ​ចាប់​ផ្ដើម​ការ​ងារ
./scripts/git-pull.sh

# 💻 ​​​​​​សរសេរ code, ​​test ...

# 🚀 ពេល​​ចង់ push code
./scripts/git-safe.sh "describe what you changed"
```

ឬ​បើ​​ចង់​ប្រើ raw commands តាម​សារ team leader៖

```bash
# 1. Pull team's latest
git stash
git pull origin main
git stash pop

# 2. Push code របស់​អ្នក
git add .
git commit -m "your message"
git push
```

ទាំង​ 2 ​​មាន​លទ្ធផល​ដូច​គ្នា — script ​គ្រាន់​តែ​ស្វ័យ​ប្រវត្តិ​ ​មិន​ភ្លេច​ជំហាន​ណា​មួយ ​​​​​​​​​​​​​​​​​​​​​​​​​​​​និង​មាន​ error ​​​handling ច្បាស់​ៗ​។

---

## ⚠️ ច្បាប់​សំខាន់

| ✅ ត្រូវ​ធ្វើ | ❌ កុំ​ធ្វើ |
|---|---|
| Pull មុន push រាល់​ពេល | Push ដោយ​មិន pull មុន |
| ប្រើ commit message ច្បាស់ៗ | "update", "fix", "msg" |
| Commit ​តូចៗ​ច្រើន​ដង | Commit ​​​ធំៗ​មួយ​ដង |
| ​ចែ​​ក​​ដាន​ជូន team បើ​មាន conflict | លាក់ ​បន្ត​ធ្វើ​ការ​​​​​​​​ |
| ​ប្រើ `git-recover.sh` ​ពេល​ជាប់ | ប្រើ​ `git push -f` ​​​​បង្ខំ |
| Test code មុន push | Push code ខូច​ឱ្យ team debug |

---

## 🛠️ ​​ការ​ដំឡើង​លើក​ដំបូង (Linux/Mac)

ធ្វើ​ឱ្យ scripts អាច​ដំណើរ​ការ​បាន​ (តែ​ម្ដង​គត់​)៖
```bash
chmod +x scripts/*.sh
```

Windows ​មិន​ត្រូវ​ការ​ជំហាន​នេះ​ទេ — `.bat` files ​ដំណើរ​ការ​ផ្ទាល់។

---

## 🐛 Troubleshooting

| បញ្ហា | ដំណោះ​ស្រាយ |
|---|---|
| `Permission denied` លើ `.sh` | `chmod +x scripts/*.sh` |
| `[CONFLICT] Stash pop has conflicts` | កែ → `git add <files>` → `git stash drop` |
| `Pull failed` (auth error) | ពិនិត្យ SSH key ឬ token |
| Rebase/merge ​ជាប់ | `./scripts/git-recover.sh` |
| ​បាត់ commit ​​​ដោយ​ចៃ​ដន្យ | `./scripts/git-recover.sh` ​​​→ ​ស្ដារ​ពី​ reflog |
| `[ERROR] A merge/rebase is already in progress` | Run `git-recover.sh` មុន |

---

## 📁 ឯកសារ​ក្នុង scripts/

```
scripts/
├── git-pull.sh       (Linux/Mac/Git Bash)  ← Pull តែ​មួយ​មុខងារ
├── git-pull.bat      (Windows)             ← Pull តែ​មួយ​មុខងារ
├── git-safe.sh       (Linux/Mac/Git Bash)  ← Pull + Commit + Push
├── git-safe.bat      (Windows)             ← Pull + Commit + Push
├── git-recover.sh    (Linux/Mac/Git Bash)  ← Recover stuck git
├── git-recover.bat   (Windows)             ← Recover stuck git
└── README.md         (this file)
```

---

## 🎯 ​​សង្ខេប

| ស្ថាន​ភាព | Command |
|---|---|
| 🌅 ​ចាប់​ផ្ដើម​​ការ​ងារ | `./scripts/git-pull.sh` |
| 🚀 ត្រៀម push | `./scripts/git-safe.sh "msg"` |
| 🆘 Git ជាប់ | `./scripts/git-recover.sh` |

​​​ ​ដើម្បី​ឱ្យ​​ team ​ធ្វើ​ការ​​​​​​​​​​​​​ឯករាជ្យ ​ដោយ​មិន​​ឱ្យ code ជាន់​គ្នា 🎉
