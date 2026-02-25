# Fix Published Exams Not Visible to Students

## Problem
Published exams are not showing up on the student dashboard.

## Root Cause
The `examId` field was not being stored in Firestore documents when exams were created. Students' exam list depends on this field.

## Solution Implemented

### 1. Code Fixes (Already Applied)
- Updated `createExam()` to automatically set `examId` field
- Added fallback logic to all exam retrieval functions
- All new exams will work correctly

### 2. Migration Required for Existing Exams

**You need to run the migration once to fix existing exams.**

## How to Run Migration

### Step 1: Log in as Admin
Log in with your admin account (e.g., isak@gmail.com)

### Step 2: Navigate to Migration Page
Go to: `http://localhost:5173/migrate-exams` (or your production URL + `/migrate-exams`)

### Step 3: Run Migration
1. Click the "Run Migration Now" button
2. Wait for completion (usually takes a few seconds)
3. You'll see a success message with statistics

### Step 4: Verify
1. Ask students to refresh their browsers
2. Published exams should now appear in "Available Exams"
3. Students can start taking exams

## What the Migration Does

- Scans all exams in the database
- Adds the missing `examId` field to each exam
- Skips exams that already have the field
- Safe to run multiple times

## After Migration

Once complete:
- All published exams will be visible to students
- Students can start taking exams immediately
- No further action needed
- Future exams will work automatically

## Troubleshooting

If exams still don't show up after migration:
1. Check that exams are marked as "Published" (isPublished = true)
2. Verify exam dates (startTime/endTime) are correct
3. Check department restrictions (if exam is department-specific)
4. Ask students to clear browser cache and refresh

## Technical Details

Files modified:
- `src/lib/firebase-exams.ts` - Added examId field to createExam
- `src/pages/MigrateExams.tsx` - Beautiful migration UI
- `src/App.tsx` - Added /migrate-exams route (admin only)

The migration page is protected and only accessible to admin users.
