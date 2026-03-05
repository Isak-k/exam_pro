# Deploy Firestore Indexes

## Quick Fix

Run this command in your terminal:

```bash
firebase deploy --only firestore:indexes
```

This will deploy the required indexes for the leaderboard to work.

## What This Does

The command deploys the indexes defined in `firestore.indexes.json` to your Firebase project. Indexes are required when you query Firestore with:
- Multiple `where` clauses
- `where` + `orderBy` combinations
- Complex queries

## After Deployment

1. Wait 1-2 minutes for indexes to build
2. Refresh your leaderboard page
3. The error should be gone!

## Alternative: Click the Link

You can also click the link in the error message to create the index directly in Firebase Console:
```
https://console.firebase.google.com/v1/r/project/online-exam-f443c/firestore/indexes?create_composite=...
```

## Verify Indexes

Check your indexes in Firebase Console:
1. Go to Firebase Console
2. Select your project
3. Go to Firestore Database
4. Click on "Indexes" tab
5. You should see the new index building or completed

---

**Note:** I've also updated the simple leaderboard code to work without requiring the index, so it should work even before you deploy!
