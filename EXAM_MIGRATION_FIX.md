# Exam Migration Fix

## Issue
Published exams were not showing up on the student dashboard because the `examId` field was not being stored in the Firestore documents when exams were created.

## What Was Fixed

### 1. Updated `createExam` function
- Now sets the `examId` field in the document after creation
- The `examId` field matches the Firestore document ID

### 2. Updated all exam retrieval functions
- `getExam()` - Now uses `examId` from data with fallback to doc.id
- `getExamsByCreator()` - Same fallback logic
- `getAllExams()` - Same fallback logic
- `getPublishedExams()` - Same fallback logic

## Migration for Existing Exams

If you have existing exams in your database that don't have the `examId` field, you need to run this migration:

### ✅ RECOMMENDED: Use the Migration Page

1. Log in as an admin
2. Navigate to `/migrate-exams` in your browser
3. Click "Run Migration Now"
4. Wait for completion
5. Ask students to refresh their browsers

The migration page is now available at `/migrate-exams` (admin only).

### Option 1: Firebase Console (Manual)
1. Go to Firebase Console > Firestore Database
2. Open the `exams` collection
3. For each exam document:
   - Click on the document
   - Add a new field: `examId` (string)
   - Set the value to the document ID (shown at the top)
   - Save

### Option 2: Run Migration Script (Recommended)

Create a temporary page or run this in the browser console while logged in as admin:

```javascript
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

async function migrateExams() {
  const examsRef = collection(db, 'exams');
  const snapshot = await getDocs(examsRef);
  
  let updated = 0;
  let skipped = 0;
  
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    
    // Check if examId is missing or doesn't match doc.id
    if (!data.examId || data.examId !== docSnap.id) {
      await updateDoc(doc(db, 'exams', docSnap.id), {
        examId: docSnap.id
      });
      console.log(`Updated exam: ${docSnap.id}`);
      updated++;
    } else {
      skipped++;
    }
  }
  
  console.log(`Migration complete: ${updated} updated, ${skipped} skipped`);
  return { updated, skipped };
}

// Run the migration
migrateExams().then(result => {
  console.log('Migration result:', result);
}).catch(error => {
  console.error('Migration error:', error);
});
```

### Option 3: Create a Migration Page

~~Add this to your routes temporarily:~~

**UPDATE: The migration page has been added to the app!** 

Simply navigate to `/migrate-exams` as an admin to run the migration.

The page is located at `src/pages/MigrateExams.tsx` and is protected by admin-only access.

The page is located at `src/pages/MigrateExams.tsx` and is protected by admin-only access.

## Testing

After migration:
1. Log in as a student
2. Go to "Available Exams"
3. Published exams should now appear
4. Verify you can start an exam

## Prevention

The fix ensures that:
- All new exams will have the `examId` field set automatically
- All exam retrieval functions have fallback logic for backward compatibility
- The system works with both old and new exam documents
