# Security Validation Implementation

## Overview

This document describes the security validation features implemented in the leaderboard Firebase Functions to satisfy Requirements 5.3 and 5.5 of the Modern Leaderboard System specification.

## Implemented Features

### 1. Authentication Verification (Requirement 5.1, 5.6)

All leaderboard functions now require user authentication:

- `calculateDepartmentLeaderboard`: Requires authenticated user
- `calculateGlobalDepartmentLeaderboard`: Requires authenticated user

**Implementation:**
- `verifyAuthAndGetProfile()` function checks `context.auth` to ensure user is authenticated
- Returns user profile with userId, fullName, departmentId, and role
- Throws `unauthenticated` error if user is not logged in

### 2. Department Membership Validation (Requirement 5.2, 5.6)

The `calculateDepartmentLeaderboard` function validates that users can only access their own department's leaderboard:

**Rules:**
- **Admins and Superadmins**: Can access any department's leaderboard
- **Students**: Can only access their own department's leaderboard
- **Unauthorized Access**: Denied with `permission-denied` error

**Implementation:**
- `verifyDepartmentAccess()` function checks user role and department membership
- Compares `userProfile.departmentId` with `requestedDepartmentId`
- Allows access if user is admin/superadmin OR if departments match

### 3. Security Logging (Requirement 5.5)

All unauthorized access attempts are logged to the `securityLogs` collection:

**Logged Information:**
- `timestamp`: When the violation occurred
- `userId`: Who attempted the unauthorized access
- `action`: What action was attempted (e.g., 'access_other_department_leaderboard')
- `reason`: Human-readable description of the violation
- `requestedDepartmentId`: Which department they tried to access
- `userDepartmentId`: Which department they belong to

**Implementation:**
- `logSecurityViolation()` function creates security log entries
- Logs are written to Firestore `securityLogs` collection
- Console warnings are also generated for monitoring

### 4. Verified Exam Results Only (Requirement 5.3)

The ranking calculation functions ensure only verified exam results are used:

**Validation:**
- Only exam attempts with `isSubmitted === true` are included
- Only attempts with valid `totalScore` and `maxScore` are processed
- Backend aggregation queries prevent frontend manipulation

## Security Flow

### calculateDepartmentLeaderboard Flow

```
1. User calls function with departmentId
2. verifyAuthAndGetProfile() checks authentication
   - If not authenticated → throw 'unauthenticated' error
3. verifyDepartmentAccess() checks department membership
   - If admin/superadmin → allow access
   - If student and departmentId matches → allow access
   - If student and departmentId doesn't match:
     - Log security violation
     - throw 'permission-denied' error
4. Calculate or retrieve cached leaderboard
5. Return results
```

### calculateGlobalDepartmentLeaderboard Flow

```
1. User calls function
2. verifyAuthAndGetProfile() checks authentication
   - If not authenticated → throw 'unauthenticated' error
3. Calculate global department rankings
4. Return results
```

## Testing the Security Features

### Manual Testing with Firebase Emulator

1. **Start the Firebase Emulator:**
   ```bash
   cd functions
   npm run serve
   ```

2. **Test Unauthenticated Access:**
   - Call the function without authentication
   - Expected: `unauthenticated` error

3. **Test Cross-Department Access (Student):**
   - Authenticate as a student in Department A
   - Try to access Department B's leaderboard
   - Expected: `permission-denied` error
   - Check `securityLogs` collection for log entry

4. **Test Same-Department Access (Student):**
   - Authenticate as a student in Department A
   - Access Department A's leaderboard
   - Expected: Success, returns leaderboard data

5. **Test Admin Access:**
   - Authenticate as an admin
   - Access any department's leaderboard
   - Expected: Success, returns leaderboard data

### Integration Testing

To test the security features in your application:

1. **Frontend Integration:**
   - The frontend should handle `unauthenticated` and `permission-denied` errors
   - Display appropriate error messages to users
   - Redirect to login page if unauthenticated

2. **Security Log Monitoring:**
   - Query the `securityLogs` collection to monitor violations
   - Set up alerts for repeated violations from the same user
   - Review logs periodically for security audits

### Example Security Log Entry

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "userId": "student-123",
  "action": "access_other_department_leaderboard",
  "reason": "Student attempted to access leaderboard from different department",
  "requestedDepartmentId": "dept-456",
  "userDepartmentId": "dept-789"
}
```

## Error Handling

### Error Types

1. **unauthenticated**: User is not logged in
   - Message: "User must be authenticated to access leaderboard data"
   - Action: Redirect to login page

2. **permission-denied**: User lacks permission
   - Message: "You do not have permission to access this department's leaderboard"
   - Action: Show error message, stay on current page

3. **invalid-argument**: Missing or invalid parameters
   - Message: "departmentId is required"
   - Action: Show error message

4. **not-found**: User profile not found
   - Message: "User profile not found"
   - Action: Show error message, may need to complete profile setup

5. **internal**: Server error
   - Message: "Failed to calculate leaderboard"
   - Action: Show generic error message, retry option

## Security Best Practices

1. **Never trust client-side validation**: All security checks are performed server-side
2. **Log all violations**: Security logs help identify attack patterns
3. **Use Firebase Authentication**: Leverage Firebase's built-in auth system
4. **Validate all inputs**: Check for required fields and valid data types
5. **Fail securely**: Deny access by default, only allow when explicitly authorized

## Firestore Security Rules

Ensure your Firestore security rules complement the function-level security:

```javascript
// Leaderboard cache - read only for authenticated users in their department
match /leaderboardCache/{departmentId} {
  allow read: if request.auth != null && 
    (request.auth.token.role in ['admin', 'superadmin'] ||
     get(/databases/$(database)/documents/userProfiles/$(request.auth.uid)).data.departmentId == departmentId);
  allow write: false; // Only functions can write
}

// Security logs - admin only
match /securityLogs/{logId} {
  allow read: if request.auth != null && 
    request.auth.token.role in ['admin', 'superadmin'];
  allow write: false; // Only functions can write
}
```

## Monitoring and Alerts

Consider setting up monitoring for:

1. **High volume of security violations**: May indicate an attack
2. **Repeated violations from same user**: May indicate malicious intent
3. **Function errors**: Monitor error rates and types
4. **Performance metrics**: Track function execution time

## Compliance

This implementation satisfies the following requirements:

- ✅ **Requirement 5.1**: Department isolation enforced
- ✅ **Requirement 5.2**: Cross-department access prevented
- ✅ **Requirement 5.3**: Only verified exam results used
- ✅ **Requirement 5.5**: Security violations logged
- ✅ **Requirement 5.6**: Department membership validated

## Future Enhancements

Consider implementing:

1. **Rate limiting**: Prevent abuse by limiting function calls per user
2. **IP-based logging**: Track violations by IP address
3. **Automated blocking**: Temporarily block users with repeated violations
4. **Audit trail**: Comprehensive logging of all leaderboard access
5. **Admin dashboard**: UI for viewing security logs and violations
