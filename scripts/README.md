# 🤝 Team Git Helper Scripts

Scripts ដើម្បី​​​ pull/push code ​ជាមួយ​ team ដោយ​មិន​បាត់​ការ​ផ្លាស់ប្ដូរ​​ និង​មិន​ឱ្យ code ជាន់​គ្នា។

> 💡 ស្រាប់​បាន​ដោះស្រាយ​បញ្ហា​ធ្ងន់ៗ​ដូចជា merge conflicts, lost changes, និង stuck rebase។

---

## ⚡ Quick Start

| ស្ថានភាព​របស់​អ្នក | Command |
|---|---|
| 🌅 ​​ចាប់ផ្ដើម​ថ្ងៃ​ការងារ | `./scripts/git-pull.sh` |
| 🚀 រួច​ហើយ​ ត្រូវ push | `./scripts/git-push.sh` |
| 🆘 Git ជាប់ មិន​ដឹង​ធ្វើ​ម៉េច | `./scripts/git-recover.sh` |

Windows: ​ប្តូរ​ `./scripts/xxx.sh` ទៅ `scripts\xxx.bat`។

---

## � `git-pull` — ទាញ​ code ពី team

ទាញ​ commits ថ្មី​ៗ​ពី remote ដោយ​មិន​បាត់​ការ​ផ្លាស់ប្ដូរ​ uncommitted របស់​អ្នក។

### Run

```bash
./scripts/git-pull.sh        # Linux / Mac / Git Bash
scripts\git-pull.bat         # Windows
```

### វា​ធ្វើ​អ្វី?

```
[1/3] Stash → ការ​ផ្លាស់ប្ដូរ​ uncommitted ទុក​ដោយ​សុវត្ថិភាព
[2/3] Pull  → ទាញ commits ថ្មី​ពី origin
[3/3] Pop   → យក stash ត្រឡប់​មក​ដាក់​ជា​ដដែល
```

### ឧទាហរណ៍

```bash
$ ./scripts/git-pull.sh

========================================
  Git Pull Helper (Team)
========================================

Current branch: main

--- Local changes ---
 M src/App.jsx
?? src/NewFile.jsx

[1/3] Stashing local changes (including untracked)...
[2/3] Pulling latest from origin/main...
[3/3] Restoring stashed changes...

========================================
  Done. Up to date with origin/main
========================================
```

---

## 📤 `git-push` — Commit + Push ​​មាន​សុវត្ថិភាព

Commit ការ​ផ្លាស់ប្ដូរ​ + sync ​ជាមួយ remote + push ​ក្នុង command តែ​មួយ។

### Run

```bash
# សួរ commit message
./scripts/git-push.sh

# ឬ​​ផ្ដល់​ message ផ្ទាល់
./scripts/git-push.sh "fix login bug"

# Windows
scripts\git-push.bat
```

### វា​ធ្វើ​អ្វី?

```
[1/4] Stage    → git add -A
[2/4] Commit   → git commit -m "..."
[3/4] Rebase   → git pull --rebase origin <branch>  ← ការពារ​ជាន់​គ្នា
[4/4] Push     → git push origin <branch>
```

### ហេតុ​អ្វី​ប្រើ `--rebase` មិន​មែន merge?

| Merge | Rebase |
|---|---|
| បង្កើត commit "Merge branch..." បន្ថែម | History ​​មួយ​បន្ទាត់​ត្រង់ |
| History ច្រវាក់ ឃើញ​មិនច្បាស់ | Commits តម្រៀប​តាម​លំដាប់ |
| ❌ ច្រលំ​នៅ​ពេល​ team ធំ | ✅ ស្អាត​​ ងាយ​អាន |

---

## 🆘 `git-recover` — ស្ដារ​ពី​ Git ជាប់

ពេល rebase/merge/cherry-pick ​ជាប់​ ឬ​ក៏​បាត់ commit ដោយ​ចៃ​ដន្យ។

### Run

```bash
./scripts/git-recover.sh           # Abort + show reflog
./scripts/git-recover.sh --hard    # Abort + លុប uncommitted ផង

# Windows
scripts\git-recover.bat
scripts\git-recover.bat --hard
```

### ស្ដារ commit ដែល​បាត់

Script បង្ហាញ **reflog** (ប្រវត្តិ​ HEAD) — ​សូម​រក commit hash:

```
==> Recent reflog (last 10 entries):
abc1234 HEAD@{0}: rebase (abort): returning to refs/heads/main
def5678 HEAD@{1}: rebase (start): checkout origin/main
9ab0cde HEAD@{2}: commit: បន្ថែម login form    ← commit ដែល​បាត់!
```

ស្ដារ​៖
```bash
git reset --hard 9ab0cde
```

---

## 🌿 Workflow ​សម្រាប់ Team

### ✅ ​ត្រឹម​ត្រូវ — Feature Branch Flow

```bash
# ចាប់ផ្ដើម​ថ្ងៃ
./scripts/git-pull.sh

# បង្កើត branch ​សម្រាប់ feature ថ្មី
git checkout -b feature/add-rsvp-form

# ធ្វើការ​​ ​​​​​​​បន្ទាប់​​មក push
./scripts/git-push.sh "add RSVP form validation"

# បើក Pull Request នៅ GitHub
gh pr create --title "Add RSVP form" --body "..."
```

### ❌ មិន​ត្រឹម​ត្រូវ — ធ្វើ​ផ្ទាល់​នៅ​ main

```bash
# ❌ កុំ​ធ្វើ​បែប​នេះ
git checkout main
# ...edit files...
git commit -m "fix"
git push origin main      ← ច្រលំ​ជាមួយ team
```

---

## 📋 ការ​ប្រៀបធៀប

| ស្ថានភាព | កុំ​ធ្វើ ❌ | ​ត្រូវ​ធ្វើ ✅ |
|---|---|---|
| Pull ពេល​មាន uncommitted changes | `git pull` (ទទួល​ error) | `./scripts/git-pull.sh` |
| Push ពេល team push រួច​ហើយ | `git push -f` (បំផ្លាញ team) | `./scripts/git-push.sh` |
| Rebase ​ជាប់ មិន​ដឹង​ធ្វើ​ម៉េច | លុប `.git/` (បាត់​អ​ស់) | `./scripts/git-recover.sh` |
| ធ្វើ​ការ​លើ feature ធំ | Commit ផ្ទាល់​នៅ main | Branch ​ដាច់​ដោយ​ឡែក |

---

## � Troubleshooting

### `Permission denied: ./scripts/git-pull.sh`

ធ្វើ​ឱ្យ scripts អាច​ដំណើរ​ការ​បាន (តែ​ម្ដង​គត់):
```bash
chmod +x scripts/*.sh
```

### `[CONFLICT] Stash pop has conflicts`

មាន​ការ​ផ្លាស់​ប្ដូរ​ដូច​គ្នា​ទាំង local និង​ team:
```bash
git status                # មើល​ឯកសារ​ដែល conflict
# ...កែ​ដោយ​ដៃ​ក្នុង​​ editor...
git add <files>
git stash drop            # លុប​ stash ចាស់
```

### `[CONFLICT] Rebase has conflicts`

```bash
# Option 1: ​​​​​​​​​​​បន្ត
# ...កែ conflicts...
git add <files>
git rebase --continue

# Option 2: ​​បោះបង់​​​
./scripts/git-recover.sh
```

### បាត់​ commit ​​​​​​​​​​​​ដោយ​ចៃ​ដន្យ

```bash
./scripts/git-recover.sh
# រក commit hash ក្នុង reflog
git reset --hard <commit-hash>
```

---

## 📚 ច្បាប់​​៥​យ៉ាង​សម្រាប់ Team

1. 🌿 **Branch ថ្មី​សម្រាប់ feature ថ្មី** — កុំ​ធ្វើ​ផ្ទាល់​នៅ main
2. 🔄 **Pull មុន​ចាប់​ផ្ដើម** ​រាល់​ថ្ងៃ — សម្រាប់​សុខភាព​ team
3. 💬 **Commit messages ច្បាស់​​លាស់** — "fix login bug" មិន​មែន "update"
4. 🚫 **កុំ​ force push** លើ shared branches — បំផ្លាញ​ team
5. 💾 **Commit ច្រើន​​ដង​​​​ ​តូចៗ** — ងាយ​ revert និង​ debug

---

## 🔒 ការ​ដំឡើង​លើក​ដំបូង

```bash
# 1. ធ្វើ​ឱ្យ scripts អាច​ដំណើរ​ការ
chmod +x scripts/*.sh

# 2. បាន​ហើយ! ​​ប្រើ​​ភ្លាម
./scripts/git-pull.sh
```
