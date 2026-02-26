# Leaderboard Auto-Update Fix

## Problem
The leaderboard was not automatically updating when:
1. Users were deleted from the system
2. New users were created and took exams
3. Users changed departments

## Root Cause
The system only had a trigger for exam attempt submissions (`onExamAttemptUpdate`), but no trigger for user profile changes. When a user was deleted or modified, the leaderboard cache remained stale.

## Solution Implemented

### 1. Added User Profile Update Trigger
Created a new Firebase Cloud Function trigger `onUserProfileUpdate` that monitors the `users` collection for:
- **User Deletion**: When a student is deleted, invalidates the cache for their department
- **User Creation**: When a new student is created, invalidates the cache for their department
- **Department Changes**: When a student moves between departments, invalidates cache for both old and new departments
- **Role Changes**: When a user's role changes to/from student, invalidates the cache

### 2. Fixed Collection Name Inconsistency
Corrected all references from `userProfiles` to `users` in the Firebase functions to match the actual Firestore collection name used in the application.

## Files Modified

### Backend (Firebase Functions)
1. **functions/src/leaderboard.ts**
   - Added `onUserProfileUpdate` trigger function
   - Fixed all `userProfiles` references to `users`
   - Trigger monitors: user creation, deletion, department changes, role changes

2. **functions/src/index.ts**
   - Exported the new `onUserProfileUpdate` function

## How It Works

### Automatic Cache Invalidation
When any of these events occur, the leaderboard cache is automatically invalidated:

1. **New Exam Submission** (existing)
   - Trigger: `onExamAttemptUpdate`
   - Action: Invalidates cache for student's department

2. **User Deleted** (NEW)
   - Trigger: `onUserProfileUpdate`
   - Action: Invalidates cache for the deleted student's department
   - Result: Leaderboard recalculates without the deleted user

3. **New User Created** (NEW)
   - Trigger: `onUserProfileUpdate`
   - Action: Invalidates cache for the new student's department
   - Result: New user appears in leaderboard after taking exams

4. **User Changes Department** (NEW)
   - Trigger: `onUserProfileUpdate`
   - Action: Invalidates cache for both old and new departments
   - Result: User removed from old department leaderboard, added to new one

5. **User Role Changes** (NEW)
   - Trigger: `onUserProfileUpdate`
   - Action: Invalidates cache if role changes to/from student
   - Result: Leaderboard reflects current students only

### Cache Refresh Flow
```
User Event (delete/create/update)
    ↓
onUserProfileUpdate Trigger Fires
    ↓
Identifies Affected Department(s)
    ↓
Invalidates Cache for Department(s)
    ↓
Next Leaderboard Request
    ↓
Cache Miss → Recalculates Fresh Rankings
    ↓
Updated Leaderboard Displayed
```

## Deployment Instructions

### 1. Set Firebase Project
First, you need to set your Firebase project. If you don't know your project ID, list all projects:
```bash
firebase projects:list
```

Then set the active project:
```bash
firebase use <your-project-id>
```

Or add it as an alias:
```bash
firebase use --add
```

### 2. Deploy Firebase Functions
```bash
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

### 3. Verify Deployment
Check Firebase Console → Functions to confirm:
- `onExamAttemptUpdate` (existing)
- `onUserProfileUpdate` (NEW)
- Both triggers should show "Active" status

### 3. Test the Fix

#### Test User Deletion:
1. Note current leaderboard rankings
2. Delete a student user from Admin panel
3. Refresh leaderboard
4. Verify deleted user no longer appears

#### Test New User:
1. Create a new student account
2. Have them take and submit an exam
3. Refresh leaderboard
4. Verify new user appears in rankings

#### Test Department Change:
1. Note a student's current department leaderboard
2. Change their department via Admin panel
3. Refresh both old and new department leaderboards
4. Verify student moved correctly

## Benefits

1. **Real-time Accuracy**: Leaderboard always reflects current users
2. **Automatic Updates**: No manual cache refresh needed
3. **Data Integrity**: Deleted users immediately removed from rankings
4. **Department Isolation**: Changes only affect relevant departments
5. **Performance**: Selective cache invalidation (only affected departments)

## Technical Details

### Trigger Configuration
- **Collection**: `users`
- **Event**: `onWrite` (covers create, update, delete)
- **Scope**: Document-level (individual user changes)

### Cache Invalidation Strategy
- **Selective**: Only invalidates affected department caches
- **Efficient**: Doesn't recalculate immediately, waits for next request
- **Safe**: Errors in trigger don't break user operations

### Error Handling
- Trigger failures are logged but don't throw errors
- User operations (delete/create/update) complete successfully even if trigger fails
- Cache will eventually refresh via scheduled function (every 1 hour)

## Monitoring

### Check Trigger Logs
```bash
firebase functions:log --only onUserProfileUpdate
```

### Expected Log Messages
- "User deleted, invalidating cache for department: [departmentId]"
- "New user created, invalidating cache for department: [departmentId]"
- "User moved from department: [oldDeptId]"
- "User moved to department: [newDeptId]"
- "User role changed, invalidating cache for department: [departmentId]"
- "Cache invalidated for department: [departmentId]"

## Rollback Plan
If issues occur, you can disable the new trigger:
1. Comment out `onUserProfileUpdate` export in `functions/src/index.ts`
2. Redeploy functions
3. Use manual cache refresh via Admin panel

## Notes
- The trigger is non-blocking and won't slow down user operations
- Cache invalidation is instant, but recalculation happens on next request
- Scheduled function `refreshStaleCaches` still runs hourly as backup
- Admin can manually refresh cache anytime via Admin Leaderboard page
