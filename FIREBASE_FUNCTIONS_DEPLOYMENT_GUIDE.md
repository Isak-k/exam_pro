# Firebase Functions Deployment Guide - Automatic Cache Refresh

## What This Does

Once deployed, the leaderboard cache will automatically refresh when:
- ✅ A user is deleted
- ✅ A new user is created
- ✅ A user changes departments
- ✅ A student takes an exam
- ✅ Every hour (scheduled refresh)

## Prerequisites

1. Firebase project (you already have this)
2. Firebase CLI installed
3. Firebase Blaze plan (pay-as-you-go, but free tier is generous)

## Step 1: Install Firebase CLI

Open PowerShell and run:

```powershell
npm install -g firebase-tools
```

## Step 2: Login to Firebase

```powershell
firebase login
```

This will open your browser to login with your Google account.

## Step 3: Initialize Firebase Project

In your project folder:

```powershell
# List your projects to find the project ID
firebase projects:list

# Set the active project
firebase use <your-project-id>
```

Or create a new alias:

```powershell
firebase use --add
```

## Step 4: Check Your Firebase Plan

Firebase Functions require the **Blaze (Pay as you go)** plan.

1. Go to: https://console.firebase.google.com
2. Select your project
3. Click the gear icon → "Usage and billing"
4. If you're on Spark (free) plan, upgrade to Blaze

**Don't worry about costs:**
- First 2 million function invocations per month are FREE
- Your app will likely stay within free tier
- You can set spending limits

## Step 5: Deploy Functions

```powershell
# Make sure you're in the project root
cd C:\Users\user\Downloads\online-exam-web-main

# Deploy only functions
firebase deploy --only functions
```

This will:
- Build your functions
- Upload them to Firebase
- Make them active

**Deployment takes 2-5 minutes.**

## Step 6: Verify Deployment

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Click "Functions" in the left menu
4. You should see these functions:
   - ✅ `calculateDepartmentLeaderboard`
   - ✅ `calculateGlobalDepartmentLeaderboard`
   - ✅ `onExamAttemptUpdate` (NEW - auto-refresh on exam)
   - ✅ `onUserProfileUpdate` (NEW - auto-refresh on user changes)
   - ✅ `refreshStaleCaches` (scheduled hourly refresh)
   - ✅ `adminRefreshLeaderboardCache`
   - ✅ `adminRecalculateRankings`
   - ✅ `adminResetLeaderboard`
   - ✅ `adminGetLeaderboardStatus`

## Step 7: Test Automatic Refresh

### Test 1: Delete a User
1. Delete a student from Admin panel
2. Go to leaderboard
3. ✅ User should automatically disappear (no manual refresh needed)

### Test 2: New User Takes Exam
1. Create a new student
2. Have them take an exam
3. Go to leaderboard
4. ✅ New student should appear automatically

### Test 3: User Changes Department
1. Change a student's department
2. Check both department leaderboards
3. ✅ Student should move automatically

## Troubleshooting

### Error: "Firebase CLI not found"
```powershell
npm install -g firebase-tools
```

### Error: "No project active"
```powershell
firebase use --add
```

### Error: "Requires Blaze plan"
Upgrade your Firebase project to Blaze plan in Firebase Console.

### Functions deployed but not working
Check function logs:
```powershell
firebase functions:log
```

### Permission errors
Make sure your Firestore rules allow the functions to read/write:
```javascript
// In firestore.rules
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow functions to access everything
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Alternative: Simpler Solution Without Functions

If you can't deploy Firebase Functions right now, you can:

1. **Manual Refresh**: Click "Refresh Leaderboard" button when needed
2. **Auto-refresh on page load**: I can modify the code to always recalculate when cache is missing

Would you like me to implement the auto-refresh on page load solution instead? It's simpler but less efficient.

## Cost Estimate

For a typical exam system with 100 students:
- ~500 function invocations per day
- ~15,000 per month
- **Cost: $0** (within free tier of 2 million/month)

You'd need 130,000+ students to exceed the free tier!

## Summary

**Best solution**: Deploy Firebase Functions (one-time setup, automatic forever)
**Quick solution**: Use manual refresh button (works now, but requires clicking)
**Middle ground**: Auto-calculate on page load (I can implement this in 5 minutes)

Which would you prefer?
