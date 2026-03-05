# Department-Level Rankings Implementation

## Overview

This document describes the implementation of Task 4.1: Create Firebase Function for department-level rankings.

## Implementation Details

### Backend Function

**Location**: `functions/src/leaderboard.ts`

**Function Name**: `calculateGlobalDepartmentLeaderboard`

**Type**: HTTPS Callable Function

### What It Does

The function implements Requirements 3.1, 3.2, and 3.3:

1. **Calculates department-level rankings** (Req 3.1)
   - Aggregates performance data from all departments
   - Ranks departments based on their overall performance

2. **Shows comprehensive department statistics** (Req 3.2)
   - Department name
   - Total department score (sum of all student scores)
   - Average score (average of all students' average scores)
   - Number of active students (students with at least one exam attempt)

3. **Calculates department average correctly** (Req 3.3)
   - Computes each student's average score
   - Calculates department average from all students' average scores
   - Only includes students with at least one submitted exam

### Algorithm

1. **Fetch all departments** from the `departments` collection
2. **Fetch all students** grouped by department
3. **For each department**:
   - Get all submitted exam attempts for students in that department
   - Calculate per-student statistics (total points, exam count, average)
   - Aggregate department-level statistics:
     - Total department score = sum of all student total points
     - Department average = average of all student averages
     - Active student count = students with at least one exam
4. **Sort departments** by average score (descending), then by total score
5. **Assign rank positions** and return formatted response

### Data Flow

```
Departments Collection → Students by Department → Exam Attempts
                                                        ↓
                                              Student Statistics
                                                        ↓
                                            Department Aggregation
                                                        ↓
                                              Sorted Rankings
```

### Response Format

```typescript
{
  rankings: [
    {
      departmentId: string,
      departmentName: string,
      totalDepartmentScore: number,
      averageScore: number,
      activeStudentCount: number,
      rankPosition: number
    }
  ],
  totalDepartments: number,
  lastUpdated: Timestamp
}
```

### Frontend Integration

**Location**: `src/lib/firebase-leaderboard.ts`

**Function**: `calculateGlobalDepartmentLeaderboard()`

This function provides a typed interface to call the Cloud Function from the frontend.

### Usage Example

```typescript
import { calculateGlobalDepartmentLeaderboard } from '@/lib/firebase-leaderboard';

// Get global department rankings
const response = await calculateGlobalDepartmentLeaderboard();

console.log(`Total departments: ${response.totalDepartments}`);
response.rankings.forEach(dept => {
  console.log(`${dept.rankPosition}. ${dept.departmentName}`);
  console.log(`   Average: ${dept.averageScore}`);
  console.log(`   Students: ${dept.activeStudentCount}`);
});
```

### Testing

To test the function:

1. **Deploy the function**:
   ```bash
   cd functions
   npm run deploy
   ```

2. **Test from frontend**:
   - Import and call `calculateGlobalDepartmentLeaderboard()`
   - Verify the response contains correct department rankings

3. **Test with Firebase Emulator** (optional):
   ```bash
   cd functions
   npm run serve
   ```

### Key Features

- **Efficient batching**: Uses batched queries to handle departments with many students (avoids Firestore's 10-item limit on `in` queries)
- **Data validation**: Only includes exam attempts with valid scores
- **Proper averaging**: Calculates department average from student averages (not from raw scores)
- **Active student filtering**: Only counts students who have submitted at least one exam
- **Sorted rankings**: Departments ranked by average score, with total score as tiebreaker
- **Error handling**: Comprehensive error handling with meaningful error messages

### Performance Considerations

- The function queries all departments and students, so performance scales with database size
- For large deployments, consider:
  - Adding caching similar to the student leaderboard
  - Implementing pagination for very large result sets
  - Using scheduled functions to pre-calculate rankings

### Security

- Function is callable by authenticated users
- No department isolation needed (global view is intentional)
- Consider adding role-based access control if needed

## Files Modified

1. `functions/src/types.ts` - Added department ranking types
2. `functions/src/leaderboard.ts` - Implemented the function
3. `functions/src/index.ts` - Exported the function
4. `src/lib/firebase-leaderboard.ts` - Added frontend wrapper

## Next Steps

- Task 4.2: Write property tests for department rankings
- Task 6: Implement security rules and data protection
- Task 7: Create leaderboard UI components
