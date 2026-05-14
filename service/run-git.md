# Team Git Workflow

Two helper scripts handle the safe push flow for a team working on the same branch.

| Script | Platform |
|---|---|
| `git-push.bat` | Windows (double-click or run in CMD) |
| `git-push.sh`  | Linux / macOS / Git Bash |

## What the script does

1. Show current branch and local changes
2. If there are changes, ask for a commit message and commit
3. `git pull --rebase origin <branch>` to bring in teammates' commits
4. `git push origin <branch>`

Using `--rebase` keeps history linear and avoids "merge" commits when multiple people push.

## Usage

Windows
```bat
git-push.bat
```

Linux / macOS
```bash
./git-push.sh
./git-push.sh "feat: add login page"
```

## Recommended team rules

- Pull before you start working: `git pull --rebase`
- Commit small and often, with clear messages
- Never force-push to `main`
- For new features, create a branch:
  ```bash
  git checkout -b feature/<your-feature>
  ```
  then run the script as usual; it will offer to set upstream automatically.

## Handling conflicts during rebase

If the script stops with a conflict:

```bash
# 1. Open the conflicted files and fix the markers <<<<<<< ======= >>>>>>>
git status                    # see which files conflict
git add <fixed-files>
git rebase --continue

# Or cancel and try again later:
git rebase --abort
```

After resolving, run the script again to push.

## First-time setup (per teammate)

```bash
git config --global pull.rebase true   # default to rebase on pull
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"
```
