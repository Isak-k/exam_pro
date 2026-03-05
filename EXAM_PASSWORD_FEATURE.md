# Exam Password/PIN Feature

## Overview
Added optional password/PIN protection for exams. Examiners can set a password when creating or editing an exam, and students must enter this password before they can start the exam.

## Features

### For Examiners (Admin)
- Add optional password/PIN when creating a new exam
- Edit or remove password from existing exams
- Password field is clearly marked as optional
- Helpful description explains the feature

### For Students
- See indicator in exam start dialog if password is required
- Must enter correct password before exam starts
- Clear error message if password is incorrect
- Can go back to start dialog if they don't have the password

## How It Works

### 1. Creating an Exam with Password
1. Go to "Create Exam" page
2. Fill in exam details
3. In the "Basic Information" section, find "Access Password/PIN (Optional)"
4. Enter a password (e.g., "exam2024" or "1234")
5. Leave empty if no password is needed
6. Save the exam

### 2. Editing Exam Password
1. Go to "Edit Exam" page
2. Find "Access Password/PIN (Optional)" in the settings
3. Add, change, or remove the password
4. Save changes

### 3. Student Taking Password-Protected Exam
1. Student clicks "Start Exam"
2. Sees start dialog with "Password required to start" indicator
3. Clicks "Start Exam" button
4. Password dialog appears
5. Student enters password
6. If correct: Exam starts
7. If incorrect: Error message shown, can try again
8. Can click "Back" to return to start dialog

## Technical Implementation

### Database Schema
Added `accessPassword` field to Exam interface:
```typescript
interface Exam {
  // ... other fields
  accessPassword?: string | null; // Optional password/PIN to access exam
}
```

### Files Modified

1. **src/integrations/firebase/types.ts**
   - Added `accessPassword?: string | null` to Exam interface

2. **src/pages/CreateExam.tsx**
   - Added `access_password` to form state
   - Added password input field in UI
   - Included password in exam creation data

3. **src/pages/EditExam.tsx**
   - Added `accessPassword` to Exam interface
   - Added password input field in settings
   - Included password in exam update

4. **src/pages/TakeExam.tsx**
   - Added password dialog state management
   - Added password verification logic in `startExam()`
   - Added password dialog UI
   - Updated start dialog to show password indicator

### Security Notes

**Current Implementation:**
- Password is stored as plain text in Firestore
- Password is checked on client-side before starting exam
- Suitable for basic access control

**For Production:**
Consider these improvements:
- Hash passwords before storing
- Verify password on server-side (Firebase Functions)
- Add rate limiting to prevent brute force
- Log password attempts

## UI/UX Features

### Password Input Field
- Clear label: "Access Password/PIN (Optional)"
- Helpful placeholder: "Enter password or PIN (e.g., 1234)"
- Description: "Students will need this password to start the exam. Leave empty for no password."

### Password Dialog
- Clean, focused dialog
- Password input with visibility toggle
- Enter key support for quick submission
- Clear error messages
- Back button to return to start dialog

### Visual Indicators
- Start dialog shows warning icon with "Password required to start"
- Error message in red when password is incorrect
- Input field highlights red on error

## Translation Keys

The feature uses i18n for multi-language support. Required translation keys:

### English
- `admin.exams.form.accessPassword`
- `admin.exams.form.optional`
- `admin.exams.form.accessPasswordPlaceholder`
- `admin.exams.form.accessPasswordHelp`
- `student.exam.startDialog.passwordRequired`
- `student.exam.passwordDialog.title`
- `student.exam.passwordDialog.description`
- `student.exam.passwordDialog.label`
- `student.exam.passwordDialog.placeholder`
- `student.exam.passwordDialog.incorrect`
- `student.exam.passwordDialog.cancel`
- `student.exam.passwordDialog.submit`

See `EXAM_PASSWORD_TRANSLATIONS.md` for full translation content.

## Testing

### Test Scenarios

1. **Create exam without password**
   - Leave password field empty
   - Student should start exam immediately

2. **Create exam with password**
   - Set password "test123"
   - Student should see password dialog
   - Correct password should start exam
   - Wrong password should show error

3. **Edit exam to add password**
   - Edit existing exam
   - Add password
   - Save
   - Student should now need password

4. **Edit exam to remove password**
   - Edit exam with password
   - Clear password field
   - Save
   - Student should start exam without password

5. **Password with spaces**
   - Set password with leading/trailing spaces
   - System should trim spaces
   - Student enters password without spaces
   - Should work correctly

## Future Enhancements

Possible improvements:
1. Password strength indicator
2. Generate random password button
3. Copy password to clipboard
4. Send password to students via email
5. Time-limited passwords
6. Different passwords for different student groups
7. Password history/audit log
8. Two-factor authentication
9. Biometric authentication for mobile

## Firestore Rules

No changes needed to Firestore rules. The `accessPassword` field is:
- Readable by students (to check if password is required)
- Writable only by exam creator/admin (existing rules)

## Backward Compatibility

- Existing exams without `accessPassword` field work normally
- `accessPassword` is optional, defaults to `null`
- No migration needed for existing exams
- Students can take old exams without any changes

## Usage Examples

### Simple PIN
```
Password: 1234
```

### Memorable Password
```
Password: midterm2024
```

### Department Code
```
Password: CS101
```

### Secure Password
```
Password: Exam@2024!Secure
```

## Support

If students forget the password:
1. Contact the examiner who created the exam
2. Examiner can view/edit password in Edit Exam page
3. Examiner can share password with student
4. Student can then enter password and start exam
