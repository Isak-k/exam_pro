# Department Leaderboard Firebase Function - Implementation Guide

## Overview

This guide documents the Firebase Cloud Function implementation for Task 3.1 of the Modern Leaderboard System spec. The function calculates department-based student rankings from exam attempt data.

## Requirements Implemented

- **Requirement 1.1**: Rankings based only on students within the same department
- **Requirement 1.4**: Automatically update leaderboard when new exam results are submitted
- **Requirement 2.1**: Calculate total points from all submitted ExamAttempts
- **Requirement 2.2**: Calculate average score from all submitted ExamAttempts
- **Requirement 2.3**: Count the number of completed exams for each student

## Architecture

### Firebase Function: `calculateDepartmentLeaderboard`

**Type**: HTTPS Callable Function  
**Location**: `functions/src/leaderboard.ts`

### Data Flow

1. **Input**: Department ID
2. **Query**: Fetch all students in the department (role = 'student')
3. **Query**: Fetch all submitted exam attempts for those students
4. **Calculate**: Aggregate statistics per student (total points, average, count)
5. **Sort**: Order by total points (descending), then average score
6. **Rank**: Assign position numbers (1, 2, 3, ...)
7. **Output**: Sorted leaderboard entries with metadata

## Files Created

### Backend (Firebase Functions)

```
functions/
├── package.json              # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── .gitignore               # Ignore node_modules and build output
├── README.md                # Function documentation
└── src/
    ├── index.ts             # Main entry point, exports all functions
    ├── types.ts             # TypeScript type definitions
    └── leaderboard.ts       # Leaderboard calculation logic
```

### Frontend (Client Library)

```
src/lib/
├── firebase-leaderboard.ts       # Client-side utility to call the function
└── firebase-leaderboard.test.ts  # Unit tests for the client utility
```

### Configuration

- `firebase.json` - Updated to include functions configuration
- `firestore.indexes.json` - Added composite indexes for efficient queries

## Setup Instructions

### 1. Install Function Dependencies

```bash
cd functions
npm install
```

### 2. Build the Functions

```bash
npm run build
```

### 3. Deploy to Firebase

```bash
# From project root
firebase deploy --only functions

# Or from functions directory
npm run deploy
```

### 4. Deploy Firestore Indexes

```bash
firebase deploy --only firestore:indexes
```

## Usage

### From Frontend Code

```typescript
import { calculateDepartmentLeaderboard } from '@/lib/firebase-leaderboard';

// Get leaderboard for a department
const leaderboard = await calculateDepartmentLeaderboard('dept-123');

console.log(leaderboard.entries);      // Array of ranked students
console.log(leaderboard.totalStudents); // Number of students with attempts
console.log(leaderboard.lastUpdated);   // Timestamp of calculation
```

### Response Structure

```typescript
{
  entries: [
    {
      studentId: "student-1",
      studentName: "John Doe",
      departmentId: "dept-123",
      totalPoints: 285.5,      // Sum of all exam scores
      averageScore: 95.17,     // Average across all exams
      examCount: 3,            // Number of completed exams
      rankPosition: 1          // Position in leaderboard
    },
    // ... more entries
  ],
  totalStudents: 25,
  lastUpdated: Timestamp,
  departmentId: "dept-123"
}
```

## Key Features

### Department Isolation

The function enforces strict department boundaries:
- Only queries students with matching `departmentId`
- Only includes exam attempts from those students
- Returns department-specific rankings

### Data Validation

- Filters out attempts where `isSubmitted !== true`
- Excludes attempts with null or invalid scores
- Validates `maxScore > 0` to avoid division errors

### Performance Optimization

- Uses batched queries for large student populations (handles "in" query limit of 10)
- Processes data in memory after fetching (no repeated database calls)
- Rounds scores to 2 decimal places for consistency

### Ranking Logic

Students are sorted by:
1. **Primary**: Total points (descending)
2. **Secondary**: Average score (descending)

This ensures students with more total points rank higher, with average score as a tiebreaker.

## Database Queries

### Query 1: Get Department Students

```typescript
db.collection('userProfiles')
  .where('departmentId', '==', departmentId)
  .where('role', '==', 'student')
```

**Index Required**: `departmentId ASC, role ASC`

### Query 2: Get Submitted Attempts (Batched)

```typescript
db.collection('examAttempts')
  .where('studentId', 'in', [batch of student IDs])
  .where('isSubmitted', '==', true)
```

**Index Required**: `studentId ASC, isSubmitted ASC`

## Testing

### Run Client-Side Tests

```bash
npm test -- firebase-leaderboard.test.ts --run
```

### Test Coverage

- ✅ Validates required parameters
- ✅ Calls Firebase function with correct arguments
- ✅ Handles successful responses
- ✅ Handles error cases

### Manual Testing with Emulator

```bash
cd functions
npm run serve
```

Then call the function from your frontend with the emulator running.

## Error Handling

The function returns appropriate error codes:

- `invalid-argument`: Missing or invalid departmentId
- `internal`: Unexpected errors during calculation

All errors are logged with detailed information for debugging.

## Security Considerations

### Current Implementation

- Function is callable by any authenticated user
- No explicit department membership validation

### Recommended Enhancements (Future Tasks)

1. Validate that the caller belongs to the requested department
2. Add role-based access control (students can only view their own department)
3. Implement rate limiting to prevent abuse

Example security check:

```typescript
// Verify caller is authenticated
if (!context.auth) {
  throw new functions.https.HttpsError(
    'unauthenticated',
    'User must be authenticated'
  );
}

// Verify caller belongs to the department
const callerProfile = await db
  .collection('userProfiles')
  .doc(context.auth.uid)
  .get();

if (callerProfile.data()?.departmentId !== departmentId) {
  throw new functions.https.HttpsError(
    'permission-denied',
    'Cannot access other department leaderboards'
  );
}
```

## Performance Considerations

### Current Limitations

- Calculates leaderboard on-demand (no caching)
- May be slow for departments with many students (100+)

### Optimization Strategies (Future Tasks)

1. **Caching**: Store calculated leaderboards in Firestore
2. **Incremental Updates**: Update cache when new attempts are submitted
3. **Scheduled Recalculation**: Use Cloud Scheduler to refresh periodically
4. **Pagination**: Return top N students instead of entire leaderboard

## Next Steps

This function provides the foundation for the leaderboard system. Future tasks will:

1. Add caching mechanism (Task 3.2)
2. Implement frontend UI components (Task 4.x)
3. Add real-time updates via Firestore listeners
4. Implement global department rankings (Requirement 3)

## Troubleshooting

### Function Not Found

- Ensure functions are deployed: `firebase deploy --only functions`
- Check Firebase Console > Functions to verify deployment

### Index Errors

- Deploy indexes: `firebase deploy --only firestore:indexes`
- Wait 5-10 minutes for indexes to build

### Empty Leaderboard

- Verify students have `departmentId` set in their profiles
- Ensure exam attempts have `isSubmitted: true`
- Check that attempts have valid `totalScore` and `maxScore`

### Slow Performance

- Check department size (number of students)
- Monitor function execution time in Firebase Console
- Consider implementing caching for large departments

## Support

For issues or questions about this implementation, refer to:
- Function README: `functions/README.md`
- Spec requirements: `.kiro/specs/modern-leaderboard-system/requirements.md`
- Firebase Functions documentation: https://firebase.google.com/docs/functions
