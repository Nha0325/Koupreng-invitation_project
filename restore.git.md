# Safe Git Recovery Notes

Use the team helper scripts from the project root. They target `origin/main` and avoid force pushing.

## Pull Latest Without Losing Local Work

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\git-pull.ps1
```

Linux/macOS:

```bash
./git-pull.sh
```

The pull script temporarily stashes uncommitted work, rebases on `origin/main`, and reapplies your work.

## Push Local Work To Main

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\git-push.ps1 "your commit message"
```

Linux/macOS:

```bash
./git-push.sh "your commit message"
```

The push script pulls `origin/main` first, commits your local changes, and pushes to `origin/main`.

## Pull And Push In One Command

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\git-sync.ps1 "your commit message"
```

Linux/macOS:

```bash
./git-sync.sh "your commit message"
```

## If There Is A Conflict

```bash
git status
```

Edit conflicted files, then continue:

```bash
git add .
git rebase --continue
```

Cancel only when you intentionally want to stop the pull:

```bash
git rebase --abort
```

Do not use `git reset --hard` for normal team sync. It can delete local work.
