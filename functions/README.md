# Firebase Functions - Leaderboard System

This directory contains Firebase Cloud Functions for the Modern Leaderboard System.

## Functions

### calculateDepartmentLeaderboard

**Type:** HTTPS Callable Function

**Purpose:** Calculates and returns the leaderboard for a specific department based on submitted exam attempts.

**Requirements Implemented:**
- Requirement 1.1: Rankings based only on students within the same department
- Requirement 1.4: Automatically update leaderboard when new exam results are submitted
- Requirement 2.1: Calculate total points from all submitted ExamAttempts
- Requirement 2.2: Calculate average score from all submitted ExamAttempts
- Requirement 2.3: Count the number of completed exams for each student

**Input Parameters:**
```typescript
{
  departmentId: string  // Required: The department ID to calculate leaderboard for
}
```

**Response:**
```typescript
{
  entries: LeaderboardEntry[];  // Sorted array of student rankings
  totalStudents: number;         // Total number of students with exam attempts
  lastUpdated: Timestamp;        // When the calculation was performed
  departmentId: string;          // The department ID
}
```

**LeaderboardEntry Structure:**
```typescript
{
  studentId: string;
  studentName: string;
  departmentId: string;
  totalPoints: number;      // Sum of all exam scores
  averageScore: number;     // Average score across all exams
  examCount: number;        // Number of completed exams
  rankPosition: number;     // Position in the leaderboard (1-based)
}
```

**Key Features:**
- Maintains strict department isolation
- Only processes submitted exam attempts (isSubmitted === true)
- Handles batched queries for large student populations
- Validates scores (excludes null or invalid scores)
- Sorts by total points (primary) and average score (secondary)
- Rounds scores to 2 decimal places
- Returns empty leaderboard if no students or attempts exist

**Error Handling:**
- Returns `invalid-argument` error if departmentId is missing
- Returns `internal` error for unexpected failures
- Logs detailed error information for debugging

## Setup

1. Install dependencies:
```bash
cd functions
npm install
```

2. Build the functions:
```bash
npm run build
```

3. Test locally with emulator:
```bash
npm run serve
```

4. Deploy to Firebase:
```bash
npm run deploy
```

## Development

- Source files are in `src/`
- Compiled JavaScript output goes to `lib/`
- TypeScript configuration in `tsconfig.json`

## Calling from Frontend

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const calculateLeaderboard = httpsCallable(functions, 'calculateDepartmentLeaderboard');

const result = await calculateLeaderboard({ departmentId: 'dept-123' });
console.log(result.data); // LeaderboardResponse
```
