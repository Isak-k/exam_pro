# Quick Fix for Leaderboard Permissions Error

## The Problem
You're seeing "Missing or insufficient permissions" because the updated Firestore rules haven't been deployed to Firebase yet.

## The Solution

### Option 1: Deploy Rules via Command Line (Recommended)

1. Open your terminal in the project directory
2. Run this command:
```bash
firebase deploy --only firestore:rules
```

3. Wait for deployment to complete (usually 10-30 seconds)
4. Refresh your browser

### Option 2: Use the Batch File (Windows)

1. Double-click `deploy-rules.bat` in your project folder
2. Wait for it to complete
3. Refresh your browser

### Option 3: Deploy via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Firestore Database
4. Click on "Rules" tab
5. Copy the content from `firestore.rules` file
6. Paste it in the console
7. Click "Publish"
8. Refresh your browser

## Verify Deployment

After deploying, you can verify the rules are active:

1. Go to Firebase Console > Firestore > Rules
2. You should see the updated rules with leaderboard collections
3. The "Published" timestamp should be recent

## What the Rules Do

The updated rules allow:
- ✅ All authenticated users can read `examAttempts` (needed for leaderboard)
- ✅ All authenticated users can read/write leaderboard collections
- ✅ All your existing app functionality remains unchanged

## Still Not Working?

If you still see the error after deploying:

1. **Hard refresh your browser**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear browser cache**: Settings > Privacy > Clear browsing data
3. **Check console logs**: Press F12 and look for specific error messages
4. **Verify you're logged in**: Make sure you're authenticated

## Next Steps

Once the rules are deployed and the leaderboard loads:

1. Check if data appears (might show "No leaderboard data available" if no exam attempts exist)
2. If no data, make sure you have completed exam attempts in Firestore
3. Check browser console (F12) for debug logs showing data counts

---

**TL;DR: Run `firebase deploy --only firestore:rules` and refresh your browser!**
