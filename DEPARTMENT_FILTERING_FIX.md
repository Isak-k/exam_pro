# Department Filtering Fix

## Problem
Students can't see published exams because of department filtering logic.

## How Department Filtering Works

### When Creating an Exam:
1. Admin selects "All Departments" → `departmentId` = `undefined` (available to everyone)
2. Admin selects specific department → `departmentId` = department ID (only for that department)

### When Students View Exams:
The system filters exams based on:
1. **No department restriction** (`departmentId` is undefined) → Show to ALL students
2. **Department-specific** (`departmentId` matches student's department) → Show only to students in that department

## The Fix

Updated the filtering logic in `src/lib/firebase-exams.ts` to be more explicit:

```typescript
exams = exams.filter(exam => {
  // If exam has no department restriction, show it to everyone
  if (!exam.departmentId) {
    return true;
  }
  
  // If exam is department-specific, only show to students in that department
  if (studentDepartmentId && exam.departmentId === studentDepartmentId) {
    return true;
  }
  
  // Otherwise, hide the exam
  return false;
});
```

## Diagnostic Tool

Use `/exam-diagnostic` to check:
- Total exams in database
- Published exams
- **How many exams students can actually see**
- Department assignments for each exam
- Missing examId fields

The diagnostic now shows:
- Your department ID
- How many exams students in your department can see
- Department assignment for each exam

## Common Issues

### Issue 1: Exam set to wrong department
**Symptom:** Exam is published but students can't see it
**Solution:** 
1. Edit the exam
2. Change department to "All Departments" OR the correct department
3. Save

### Issue 2: Student has no department
**Symptom:** Student can only see exams with no department restriction
**Solution:**
1. Go to Manage Students
2. Assign student to a department
3. Student refreshes browser

### Issue 3: Exam has no examId
**Symptom:** Exam doesn't appear at all
**Solution:**
1. Go to `/migrate-exams`
2. Run migration
3. This adds examId to all exams

## Testing Department Filtering

### Test 1: All Departments Exam
1. Create exam with "All Departments"
2. Publish it
3. ALL students should see it (regardless of their department)

### Test 2: Department-Specific Exam
1. Create exam for "Computer Science" department
2. Publish it
3. Only CS students should see it
4. Other students should NOT see it

### Test 3: Student Without Department
1. Student has no department assigned
2. They should only see "All Departments" exams
3. They should NOT see department-specific exams

## How to Check Student's Department

### Option 1: Manage Students Page
1. Go to "Manage Students"
2. Find the student
3. Check their department column

### Option 2: Firebase Console
1. Go to Firestore
2. Open `users` collection
3. Find student's document
4. Check `departmentId` field

## How to Check Exam's Department

### Option 1: Edit Exam Page
1. Go to "Edit Exam"
2. Look at "Department" dropdown
3. Shows current assignment

### Option 2: Diagnostic Page
1. Go to `/exam-diagnostic`
2. Each exam shows its department
3. "All Departments" = no restriction
4. Department name = restricted to that department

## Quick Fixes

### Make exam visible to all students:
1. Edit exam
2. Set department to "All Departments"
3. Save

### Make exam visible to specific department:
1. Edit exam
2. Select the department
3. Save

### Make student see all exams:
Option A: Set all exams to "All Departments"
Option B: Assign student to the correct department

## Technical Details

### Database Structure
```typescript
// Exam document
{
  examId: "abc123",
  title: "Midterm Exam",
  isPublished: true,
  departmentId: undefined,  // All departments
  // OR
  departmentId: "CS101"     // Specific department
}

// User document
{
  userId: "user123",
  role: "student",
  departmentId: "CS101"     // Student's department
}
```

### Filtering Logic
```typescript
// Show exam if:
// 1. Exam has no departmentId (available to all)
// 2. Exam's departmentId matches student's departmentId

if (!exam.departmentId) {
  return true;  // Show to everyone
}

if (studentDepartmentId && exam.departmentId === studentDepartmentId) {
  return true;  // Show to students in this department
}

return false;  // Hide from everyone else
```

## Troubleshooting Steps

1. **Check exam is published**
   - Go to Edit Exam
   - Status should be "Published" not "Draft"

2. **Check exam department**
   - Go to `/exam-diagnostic`
   - Look at "Department" column
   - Should be "All Departments" or match student's department

3. **Check student department**
   - Go to Manage Students
   - Find the student
   - Check their department

4. **Check examId exists**
   - Go to `/exam-diagnostic`
   - All exams should have green checkmarks
   - If red X, run migration

5. **Check student can see exams**
   - Diagnostic shows "Student Can See" count
   - Should match number of published exams (if all are "All Departments")
   - Or should match published exams for their department

## Prevention

When creating exams:
- Use "All Departments" for exams everyone should take
- Use specific department only when needed
- Double-check department selection before publishing

When managing students:
- Assign all students to departments during signup
- Keep department assignments up to date
- Use consistent department names
