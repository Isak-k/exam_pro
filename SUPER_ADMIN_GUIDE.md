# Super Admin Guide

## Overview
The super admin system provides full CRUD (Create, Read, Update, Delete) control over examiner accounts. The super admin is identified by email: `isak@gmail.com`

## Features

### 1. Super Admin Privileges
- Full control over all examiner accounts
- Can create, edit, disable, and delete any examiner
- Cannot modify their own account (safety measure)
- Special badge indicator in the UI

### 2. Examiner Management

#### Create Examiner
- Click "Add Examiner" button
- Fill in full name, email, and password (min 6 characters)
- New examiner gets admin role automatically
- Account is created in Firebase Auth and Firestore

#### Edit Examiner
- Click the edit (pencil) icon
- Update full name and email
- Note: Email change in Firestore doesn't update Firebase Auth email

#### Enable/Disable Examiner
- Use the toggle switch next to each examiner
- Disabled examiners:
  - Cannot login
  - Are automatically signed out
  - Cannot access any resources
  - See "Disabled" badge in red

#### Delete Examiner
- Click the delete (trash) icon
- Confirm deletion in dialog
- Removes Firestore profile (blocks access)
- Note: Firebase Auth account remains but cannot login without profile

### 3. Access Control

#### Super Admin (isak@gmail.com)
- Can modify all examiners except themselves
- Sees "Super Admin" badge
- Gets informational card about privileges

#### Regular Admins
- Cannot modify super admin
- Cannot modify themselves
- Can only manage regular examiners

### 4. Security Features

#### Database Level (Firestore Rules)
- Disabled users blocked from all operations
- Super admin check enforced at rule level
- Users cannot enable themselves

#### Application Level
- Disabled check in `getUserProfile()`
- Automatic sign-out for disabled users
- Error message: "Your account has been disabled"

#### UI Level
- Disabled buttons for protected accounts
- Visual indicators (badges, tooltips)
- Confirmation dialogs for destructive actions

## Technical Implementation

### Files Modified
1. `src/integrations/firebase/types.ts` - Added `disabled` field to UserProfile
2. `src/lib/firebase-admin.ts` - Added `toggleExaminerStatus()` and `isSuperAdmin()`
3. `src/lib/auth.ts` - Added disabled user check in `getUserProfile()`
4. `src/pages/ManageExaminers.tsx` - Complete UI overhaul with CRUD
5. `firestore.rules` - Added `isNotDisabled()` helper and enforcement

### Key Functions

```typescript
// Check if user is super admin
isSuperAdmin(email: string): boolean

// Toggle examiner enabled/disabled status
toggleExaminerStatus(userId: string, disabled: boolean): Promise<void>

// Update examiner details
updateExaminer(userId: string, updates: Partial<UserProfile>): Promise<void>

// Delete examiner account
deleteExaminer(userId: string): Promise<void>

// Create new examiner
createExaminerAccount(email: string, password: string, name: string): Promise<string>
```

### Database Schema

```typescript
interface UserProfile {
  userId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: 'admin' | 'student';
  departmentId?: string;
  disabled?: boolean;  // NEW: If true, user cannot login
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Usage Instructions

### For Super Admin (isak@gmail.com)

1. **Login** with super admin credentials
2. **Navigate** to "Manage Examiners" from admin menu
3. **View** all examiners with status badges
4. **Create** new examiners as needed
5. **Edit** examiner details (name, email)
6. **Disable** problematic examiners (toggle switch)
7. **Delete** examiners who should be removed permanently

### For Regular Admins

1. Can view all examiners
2. Can create new examiners
3. Can edit/disable/delete regular examiners only
4. Cannot modify super admin or themselves

## Best Practices

1. **Don't disable yourself** - System prevents this
2. **Use disable instead of delete** - Preserves audit trail
3. **Confirm before deleting** - Action cannot be undone
4. **Document changes** - Keep track of who was disabled/deleted and why
5. **Regular audits** - Review examiner list periodically

## Troubleshooting

### Disabled User Trying to Login
- User sees: "Your account has been disabled. Please contact an administrator."
- Solution: Super admin must enable the account

### Cannot Modify Examiner
- Check if you're trying to modify super admin (not allowed)
- Check if you're trying to modify yourself (not allowed)
- Verify you have admin role

### Examiner Still Has Access After Disable
- Check Firestore rules are deployed: `firebase deploy --only firestore:rules`
- Verify `disabled: true` in Firestore document
- User may need to refresh/re-login

## Security Notes

1. Super admin email is hardcoded (`isak@gmail.com`)
2. To change super admin, update `isSuperAdmin()` function
3. Disabled status checked at multiple levels (app + database)
4. Firebase Auth accounts persist after Firestore deletion
5. Consider implementing audit logs for sensitive operations

## Future Enhancements

- [ ] Multiple super admins support
- [ ] Audit log for all examiner changes
- [ ] Bulk operations (disable/enable multiple)
- [ ] Email notifications on status changes
- [ ] Temporary disable with auto-enable date
- [ ] Password reset for examiners
- [ ] Role-based permissions (beyond admin/student)
