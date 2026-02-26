# Manual Leaderboard Fix - Remove Deleted Users

Since Firebase Functions aren't deployed yet, here's how to manually fix the leaderboard:

## Option 1: Delete Cache from Firebase Console (Easiest)

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Click on "Firestore Database" in the left menu
4. Find the collection called `leaderboardCache`
5. Click on your department document (the one showing usama and Haylat)
6. Click the three dots (⋮) and select "Delete document"
7. Refresh your leaderboard page

The leaderboard will recalculate automatically without the deleted users.

## Option 2: Use Browser Console (Quick)

1. Open your leaderboard page
2. Press F12 to open Developer Tools
3. Go to the "Console" tab
4. Paste this code and press Enter:

```javascript
// Import Firebase
import { getFirestore, collection, getDocs, deleteDoc } from 'firebase/firestore';

// Get Firestore instance
const db = getFirestore();

// Delete all leaderboard cache
const cacheRef = collection(db, 'leaderboardCache');
const snapshot = await getDocs(cacheRef);
snapshot.docs.forEach(async (doc) => {
  await deleteDoc(doc.ref);
  console.log('Deleted cache:', doc.id);
});

console.log('Cache cleared! Refresh the page.');
```

4. Refresh the page (F5)

## Option 3: Simpler Browser Console Command

If Option 2 doesn't work, try this simpler version:

1. Open browser console (F12)
2. Paste this:

```javascript
fetch('https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/leaderboardCache', {
  method: 'DELETE'
}).then(() => {
  console.log('Cache cleared!');
  location.reload();
});
```

Replace `YOUR_PROJECT_ID` with your actual Firebase project ID.

## Why This Works

The leaderboard shows cached data from the `leaderboardCache` collection. When you delete this cache:
1. The cache is empty
2. The leaderboard tries to read from cache
3. Cache is missing, so it recalculates from scratch
4. It only includes users that currently exist in the database
5. Deleted users (usama and Haylat) are gone!

## After This Fix

You'll need to manually clear the cache each time you delete users, until Firebase Functions are deployed.

## Long-term Solution

Deploy Firebase Functions so the cache automatically updates when users are deleted. But for now, manually clearing the cache works perfectly.
