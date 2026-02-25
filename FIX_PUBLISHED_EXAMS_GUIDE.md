# Fix Published Exams Not Showing to Students

## Problem
Published exams are not appearing on the student dashboard even though they are marked as published.

## Root Cause
Exams created before the migration don't have the `examId` field in Firestore. The student exam list depends on this field to display exams.

## Solution - 3 Steps

### Step 1: Check if Migration is Needed

1. Log in as admin
2. Go to: `http://localhost:5173/exam-diagnostic` (or your URL + `/exam-diagnostic`)
3. Look at the diagnostic results:
   - **Green checks** = Exam is OK, students can see it
   - **Red X** = Exam is missing examId field, students CANNOT see it
   - **Yellow warning** = Exam has examId but it's mismatched

### Step 2: Run Migration (If Needed)

If you see any red X marks:

1. Click the "Run Migration to Fix" button
2. OR navigate to `/migrate-exams`
3. Click "Run Migration Now"
4. Wait for completion
5. You'll see how many exams were updated

### Step 3: Verify Fix

1. Go back to `/exam-diagnostic`
2. All exams should now have green checks
3. Ask students to refresh their browser
4. Published exams should now appear

## Quick Links

- **Diagnostic Page**: `/exam-diagnostic` (Check exam status)
- **Migration Page**: `/migrate-exams` (Fix missing examId fields)

## What the Migration Does

The migration:
1. Scans all exams in the database
2. Finds exams without `examId` field
3. Adds `examId` field = document ID
4. Skips exams that already have `examId`
5. Safe to run multiple times

## After Migration

- All new exams automatically get `examId` field
- Existing exams now have `examId` field
- Students can see all published exams
- No further action needed

## Troubleshooting

### Students still can't see exams after migration

1. Check exam is published:
   - Go to Edit Exam
   - Look for "Published" status
   - Click "Publish" if it says "Draft"

2. Check department restrictions:
   - Exam might be restricted to specific department
   - Student must be in that department
   - Or set exam to "All Departments"

3. Check exam dates:
   - Start time might be in the future
   - End time might have passed
   - Remove dates or adjust them

4. Ask student to:
   - Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
   - Clear browser cache
   - Log out and log back in

### Migration fails

1. Check Firebase connection
2. Check you're logged in as admin
3. Check browser console for errors
4. Try again - migration is safe to retry

### Diagnostic page shows errors

1. Check Firebase rules allow reading exams
2. Check you're logged in
3. Check browser console for errors

## Prevention

Going forward:
- All new exams automatically get `examId`
- No migration needed for new exams
- The fix is permanent

## Technical Details

The `examId` field is used by:
- `getPublishedExams()` - To list exams for students
- `ExamCard` component - To display exam details
- `TakeExam` page - To load exam content

Without `examId`, the exam data structure is incomplete and students can't access the exam.

## Support

If issues persist:
1. Run diagnostic: `/exam-diagnostic`
2. Take screenshot of results
3. Check browser console for errors
4. Verify Firestore rules are correct
5. Check exam is actually published
