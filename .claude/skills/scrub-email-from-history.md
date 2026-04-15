---
name: scrub-email-from-history
description: Use git-filter-repo to remove an email address from author or committer headers across the entire git history, with safety net
---

# Scrub an email address from git history

Sometimes you commit with the wrong author email (personal address
on a public repo, an old company email after a job change, etc.)
and want to retroactively rewrite the history. `git-filter-repo`
with a mailmap is the cleanest tool for this.

## Prerequisites

```bash
which git-filter-repo
```

If absent: `sudo pacman -S git-filter-repo` (cachyos/arch),
`apt install git-filter-repo` (debian-likes), or
`pip install git-filter-repo`.

## SAFETY NET: backup first

`git-filter-repo` is destructive in TWO ways — it rewrites history
AND it silently discards uncommitted tracked-file edits when it
checks out the new HEAD. **Always rsync-backup the entire working
tree before running it.**

```bash
rsync -a --delete ~/.gh/<project>/ ~/.gh/<project>-bkp/
```

If you have any uncommitted work, **commit or stash it first**
(see `fix-after-filter-repo.md` for recovery if you forget).

## Steps

### 1. Inventory which commits use the bad email

```bash
git log --all --format='%h %ae %ce %s' | grep -i <bad-email>
```

This shows you exactly which commits will be rewritten and what
they say. Confirm before proceeding.

### 2. Write the mailmap

A mailmap line maps `<bad-email>` to `<good-name> <good-email>`:

```bash
cat > /tmp/mailmap <<'EOF'
Mark Constable <markc@renta.net> <mconstable@gmail.com>
EOF
```

Format: `<canonical-name> <canonical-email> <bad-email>`. The
canonical name and email are what every matching commit gets
rewritten to. The `<bad-email>` matches the original author OR
committer.

### 3. Run filter-repo

```bash
git-filter-repo --mailmap /tmp/mailmap --force
```

`--force` is required if your repo has been pushed (filter-repo
refuses by default to protect against accidental destruction).

Output should mention:
- "Parsed N commits"
- "HEAD is now at <new-sha> <message>"
- "NOTICE: Removing 'origin' remote" — this is intentional, see
  step 4

### 4. Verify the rewrite

```bash
git log --all --format='%ae %ce' | grep -i <bad-email> && echo "STILL PRESENT" || echo "clean"
git log --oneline -10
```

Should report `clean`. The SHAs of every commit downstream of
the rewritten one will have changed.

### 5. Re-add the remote

filter-repo deliberately removes `origin` to guard against
accidentally pushing to the wrong place:

```bash
git remote add origin https://github.com/<user>/<repo>.git
```

### 6. Force-push

```bash
git fetch origin main
git push --force-with-lease origin main
```

`--force-with-lease` refuses if someone else has pushed since
your last fetch. Safer than `--force`.

### 7. Verify on GitHub

```bash
gh api repos/<user>/<repo>/commits/<new-tip-sha> \
    --jq '{sha: .sha, author: .commit.author.email, committer: .commit.committer.email}'
```

Should show the correct email.

### 8. Clean up the backup

After confirming everything is clean and the team (if any) has
re-cloned:

```bash
rm -rf ~/.gh/<project>-bkp/
```

## Consequences

- **All commit SHAs change** for commits downstream of the
  rewritten commit (including unrelated commits, because their
  parent SHA changes too).
- **Anyone with the repo cloned** will see divergence on their
  next fetch and need to re-clone or `git reset --hard origin/main`.
- **Open PRs based on the old history** will need rebasing.
- **GitHub retains the old commits** as unreachable objects for
  ~30 days. They're not indexed but could be fetched by SHA
  until GC. For privacy rewrites this is usually acceptable;
  if you need harder eviction, contact GitHub Support.

## Don't

- Don't run filter-repo without an rsync backup
- Don't run filter-repo without committing or stashing in-progress
  work first
- Don't use `--force` instead of `--force-with-lease` when pushing
- Don't forget to re-add the origin remote
- Don't run filter-repo on a shared branch without coordinating
  with collaborators
