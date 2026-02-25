# Push to GitHub - Manual Steps

There's a git lock file preventing automatic push. Follow these steps:

## Step 1: Close Any Git Processes
- Close any Git GUI applications (GitHub Desktop, GitKraken, etc.)
- Close any terminals that might be running git commands
- Wait 10 seconds

## Step 2: Remove Lock File
Open a new terminal and run:
```bash
rm .git/index.lock
```

Or on Windows PowerShell:
```powershell
Remove-Item .git\index.lock -Force
```

## Step 3: Abort the Rebase
```bash
git rebase --abort
```

## Step 4: Check Status
```bash
git status
```

## Step 5: Pull Remote Changes
```bash
git pull origin main
```

If there are conflicts, resolve them and commit.

## Step 6: Push Your Changes
```bash
git push origin main
```

## Alternative: Force Push (Use with Caution)
If you're sure you want to overwrite remote changes:
```bash
git push origin main --force
```

⚠️ WARNING: Force push will overwrite any changes on GitHub that aren't in your local repository.

## What Was Changed

The following changes are ready to push:
- ✅ Added .env to .gitignore (protects your API key)
- ✅ Hardcoded API key support in BulkImportQuestions component
- ✅ Improved leaderboard with better logging
- ✅ Fixed leaderboard score calculation
- ✅ Modernized exam submit dialog

## Security Note

Your .env file with the API key is now protected and won't be pushed to GitHub thanks to the .gitignore update.
