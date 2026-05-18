# Git restore notes

Team recovery steps for this repo. Run commands from the repository root unless noted.

```txt
/home/star/Desktop/Koupreng-invitation_project
```

Related helpers: `git-pull.sh`, `git-push.sh` (same folder).

---

## 1. Check remote and SSH

```bash
cd /home/star/Desktop/Koupreng-invitation_project && git remote -v
```

```bash
ssh -o BatchMode=yes -T git@github.com 2>&1 | head -n 20
```

Expected remote:

```txt
origin  git@github.com:Nha0325/Koupreng-invitation_project.git
```

If SSH fails, fix keys or use HTTPS before pull/push/restore.

---

## 2. Inspect history (pick a commit)

```bash
git log --oneline -20
git status
```

Copy the short hash you want (example: `2e3e830`).

---

## 3. Hard reset to a commit (destructive)

**Warning:** Discards all uncommitted work and moves the branch to that commit. Use only when you mean to throw away local changes.

```bash
cd /home/star/Desktop/Koupreng-invitation_project
git reset --hard <commit-hash>
```

Example:

```bash
git reset --hard 2e3e830
```

To match the remote branch instead of an old hash:

```bash
git fetch origin
git reset --hard origin/$(git branch --show-current)
```

---

## 4. Restore a single file from HEAD or a commit

```bash
git restore path/to/file
git restore --source=<commit-hash> path/to/file
```

---

## 5. Sync after reset

If you need latest from GitHub without local edits:

```bash
./runGit/git-pull.sh
```

If you reset behind `origin` and must update the remote (coordinate with the team first):

```bash
git push --force-with-lease origin $(git branch --show-current)
```

---

## 6. Safer alternative: stash instead of reset

```bash
git stash push -u -m "backup before restore"
git restore .
git pull origin $(git branch --show-current)
git stash pop   # only if you still need those changes
```

`git-pull.sh` already stashes, pulls, and pops when the tree is dirty.
