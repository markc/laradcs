---
name: fix-after-filter-repo
description: Recover uncommitted tracked-file edits after git-filter-repo silently resets the working tree
---

# Recover after `git-filter-repo` reset the working tree

## Symptom

You ran `git-filter-repo` to rewrite history (e.g. to scrub an
old email from author/committer headers). After it completed,
your working tree is **mysteriously reverted** — every tracked
file you'd edited but not committed is back to the state of
HEAD before the rewrite.

Untracked files (new files you created) and gitignored dirs
(`vendor/`, `node_modules/`) are unaffected.

## Cause

`git-filter-repo` rewrites HEAD and then **checks out the new
HEAD into the working tree**, just like `git reset --hard HEAD`
would. Any uncommitted edits to tracked files are silently
discarded by the checkout. The filter-repo docs warn about this
but it's easy to miss because the verbose output focuses on the
history rewrite, not the working-tree checkout.

## Recovery

### If you have an rsync backup

```bash
# Restore the specific tracked files you'd edited.
# The list below is just an example — check `git status` BEFORE
# the rewrite (or grep your shell history) to know what to copy.

cd ~/.gh/<project>
for f in composer.json composer.lock package.json config/<...>.php \
         resources/views/app.blade.php routes/web.php \
         <other files you edited>; do
    if [ -f ~/.gh/<project>-bkp/$f ]; then
        cp ~/.gh/<project>-bkp/$f $f
        echo "restored $f"
    fi
done
```

After restoration, run the verify-build gate (see `verify-build.md`)
to confirm everything still works, then commit normally.

### Final diff to confirm nothing else differs

```bash
diff -rq <project> <project>-bkp 2>&1 \
    | grep -v "^Only in" \
    | grep -v "Common subdirectories" \
    | grep -v "\.git/" \
    | grep -v node_modules \
    | grep -v vendor \
    | grep -v "database\.sqlite" \
    | grep -v "storage/framework"
```

The output should be EMPTY. Anything listed is a difference you
still need to resolve.

### If you don't have a backup

Check the git reflog — `git reflog` shows the SHAs of every
ref movement, including the pre-filter-repo HEAD. You can
`git checkout <old-sha> -- <file>` to recover individual files
from the OLD history.

But the reflog is per-repo and doesn't survive a `git gc`. If
filter-repo already ran a gc (it does by default with `--force`),
even the reflog might be empty. **Always have an rsync backup
before running filter-repo.**

## Prevention

Before running `git-filter-repo`:

1. **Commit or stash** any in-progress work first.
2. **Make an rsync backup** of the entire working tree:

   ```bash
   rsync -a --delete ~/.gh/<project>/ ~/.gh/<project>-bkp/
   ```
3. **Document the SHA** of the current HEAD so you can verify
   the rewrite landed correctly:

   ```bash
   git rev-parse HEAD > /tmp/pre-filter-repo-head
   ```

After the rewrite is force-pushed and you've confirmed it landed
correctly, the backup can be deleted. Until then, keep it.

## The rule

**`git-filter-repo` is destructive in two ways:**

1. It rewrites history (the obvious destructiveness)
2. It silently discards uncommitted tracked-file edits (the trap)

The second is what bit me in the laradcs Apr 15 evening session.
The rsync backup at `~/.gh/laradcs-bkp` saved the entire upgrade
+ AI work that I'd done that day but not yet committed.
