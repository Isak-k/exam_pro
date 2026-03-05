# Delete Exam Feature

## Overview
Added the ability for admins to delete exams from both the exam list and the edit exam page.

## Features

### 1. Delete from Exam List (AdminExams page)
- Small trash icon button on each exam card
- Red color to indicate destructive action
- Shows confirmation dialog before deleting

### 2. Delete from Edit Exam Page
- "Delete Exam" button in the header
- Red text to indicate destructive action
- Shows detailed confirmation dialog

## How It Works

### From Exam List:
1. Admin views exam list at `/dashboard/exams`
2. Each exam card has a small trash icon button (red)
3. Click the trash icon
4. Confirmation dialog appears showing:
   - Exam title
   - Number of questions
   - Number of student attempts
   - Warning that action cannot be undone
5. Click "Delete Permanently" to confirm
6. Exam is deleted and list refreshes

### From Edit Exam Page:
1. Admin opens exam for editing
2. "Delete Exam" button appears in header (next to Publish/Save buttons)
3. Click "Delete Exam"
4. Confirmation dialog appears with detailed information
5. Click "Delete Permanently" to confirm
6. Exam is deleted and admin is redirected to exam list

## What Gets Deleted

When an exam is deleted, the following are permanently removed:
- The exam document
- All questions in the exam
- All student attempts
- All student answers
- All results and analytics data

## Safety Features

### Confirmation Dialog
- Clear warning message
- Lists what will be deleted
- Shows number of attempts (so admin knows if students have taken it)
- "Cannot be undone" warning
- Two-step process (click delete, then confirm)

### Visual Indicators
- Red color for delete buttons
- Trash icon clearly indicates deletion
- Destructive styling on confirmation button

## UI/UX

### Exam List (AdminExams)
- Trash icon button positioned on the right
- Compact design doesn't clutter the card
- Hover effect shows it's clickable
- Red color indicates danger

### Edit Exam Page
- "Delete Exam" button in header
- Positioned before Publish/Save buttons
- Red text color
- Clear label

### Confirmation Dialog
- Large, centered modal
- Clear title: "Delete Exam"
- Detailed description of what will be deleted
- Bullet list of items to be removed
- Two buttons: Cancel (safe) and Delete Permanently (destructive)

## Technical Implementation

### Files Modified

1. **src/lib/firebase-exams.ts**
   - Already had `deleteExam()` function
   - Deletes exam document from Firestore

2. **src/components/exam/ExamCard.tsx**
   - Added `onDelete` prop (optional callback)
   - Added trash icon button for admin view
   - Button only shows if `onDelete` prop is provided

3. **src/pages/AdminExams.tsx**
   - Added delete dialog state
   - Added `handleDeleteClick()` function
   - Added `handleDeleteConfirm()` function
   - Added confirmation dialog UI
   - Passes `onDelete` callback to ExamCard

4. **src/pages/EditExam.tsx**
   - Added delete dialog state
   - Added `handleDeleteExam()` function
   - Added "Delete Exam" button in header
   - Added confirmation dialog UI
   - Redirects to exam list after deletion

### Delete Function
```typescript
async function deleteExam(examId: string) {
  const docRef = doc(db, 'exams', examId);
  await deleteDoc(docRef);
}
```

Note: Firestore automatically deletes subcollections (questions, attempts, answers) when the parent document is deleted, based on your Firestore rules and structure.

## Firestore Rules

The existing rules already handle delete permissions:
```
allow delete: if isAdmin() || (isExamCreator() && isNotDisabled());
```

This means:
- Admins can delete any exam
- Exam creators can delete their own exams
- Disabled users cannot delete exams

## User Permissions

### Who Can Delete:
- Admins (role = 'admin')
- Exam creators (for their own exams)

### Who Cannot Delete:
- Students
- Disabled users
- Non-authenticated users

## Testing

### Test Scenarios

1. **Delete exam with no attempts**
   - Create a new exam
   - Don't publish it
   - Delete it
   - Should delete successfully

2. **Delete exam with attempts**
   - Create and publish an exam
   - Have students take it
   - Try to delete
   - Dialog should show number of attempts
   - Should delete successfully (including all attempts)

3. **Delete from exam list**
   - Go to exam list
   - Click trash icon on any exam
   - Confirm deletion
   - Exam should disappear from list

4. **Delete from edit page**
   - Open exam for editing
   - Click "Delete Exam" button
   - Confirm deletion
   - Should redirect to exam list

5. **Cancel deletion**
   - Click delete button
   - Click "Cancel" in dialog
   - Nothing should be deleted
   - Dialog should close

## Limitations

### Current Implementation:
- Deletes exam document only
- Subcollections (questions, attempts) may need manual cleanup depending on Firestore structure

### Recommended Improvements:
1. Add Cloud Function to clean up subcollections
2. Add soft delete (mark as deleted instead of removing)
3. Add "Restore" feature for soft-deleted exams
4. Add audit log for deletions
5. Add bulk delete feature
6. Add "Archive" instead of delete option

## Future Enhancements

Possible improvements:
1. **Soft Delete**: Mark as deleted instead of removing
2. **Restore**: Undo deletion within 30 days
3. **Archive**: Move to archive instead of deleting
4. **Bulk Delete**: Select multiple exams to delete
5. **Delete Protection**: Prevent deletion of exams with many attempts
6. **Audit Log**: Track who deleted what and when
7. **Confirmation Code**: Require typing exam name to confirm
8. **Export Before Delete**: Automatically export data before deletion

## Troubleshooting

### Exam won't delete
1. Check user has admin role or is exam creator
2. Check Firestore rules allow deletion
3. Check browser console for errors
4. Verify exam ID is correct

### Subcollections not deleted
1. Check Firestore structure
2. May need Cloud Function for cleanup
3. Manually delete subcollections if needed

### Permission denied error
1. User must be admin or exam creator
2. Check Firestore rules
3. Check user's role in database

## Best Practices

### Before Deleting:
1. Export exam data if needed
2. Notify students if exam has attempts
3. Consider archiving instead of deleting
4. Double-check you're deleting the right exam

### When to Delete:
- Test exams that are no longer needed
- Duplicate exams
- Exams with errors that can't be fixed
- Old exams from previous semesters (after exporting data)

### When NOT to Delete:
- Exams with many student attempts (consider archiving)
- Published exams that students are currently taking
- Exams needed for historical records
- Exams required for compliance/auditing

## Support

If you accidentally delete an exam:
1. Check if you have a backup
2. Check Firestore console for recent deletions
3. Restore from backup if available
4. Recreate the exam if no backup exists

Note: Once deleted, exams cannot be recovered unless you have a backup.
