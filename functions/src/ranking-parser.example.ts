/**
 * Example usage of ranking parser functions
 * 
 * This file demonstrates how to use the ranking data parser
 * utilities in the leaderboard calculation functions.
 */

import {
  parseExamAttempts,
  validateExamAttempt,
  validateExamAttemptBatch,
  formatParserError
} from './ranking-parser';
import { ExamAttemptData, UserProfileData } from './types';

/**
 * Example 1: Parsing exam attempts for ranking calculations
 */
export function exampleParseExamAttempts() {
  // Sample data
  const attempts: ExamAttemptData[] = [
    {
      attemptId: 'attempt1',
      examId: 'exam1',
      studentId: 'student1',
      isSubmitted: true,
      totalScore: 85,
      maxScore: 100
    },
    {
      attemptId: 'attempt2',
      examId: 'exam2',
      studentId: 'student2',
      isSubmitted: true,
      totalScore: 90,
      maxScore: 100
    }
  ];

  const studentProfiles = new Map<string, UserProfileData>([
    ['student1', {
      userId: 'student1',
      fullName: 'John Doe',
      departmentId: 'dept1',
      role: 'student'
    }],
    ['student2', {
      userId: 'student2',
      fullName: 'Jane Smith',
      departmentId: 'dept1',
      role: 'student'
    }]
  ]);

  // Parse attempts
  const result = parseExamAttempts(attempts, studentProfiles);

  console.log(`Valid attempts: ${result.validAttempts.length}`);
  console.log(`Errors: ${result.errors.length}`);

  // Use valid attempts for ranking calculations
  result.validAttempts.forEach(attempt => {
    console.log(`Student ${attempt.studentId} scored ${attempt.score}/${attempt.maxScore}`);
  });

  // Log errors
  result.errors.forEach(({ attemptId, error }) => {
    console.error(`Error in attempt ${attemptId}: ${formatParserError(error)}`);
  });

  return result;
}

/**
 * Example 2: Validating a single exam attempt
 */
export function exampleValidateSingleAttempt() {
  const attempt: ExamAttemptData = {
    attemptId: 'attempt1',
    examId: 'exam1',
    studentId: 'student1',
    isSubmitted: true,
    totalScore: 85,
    maxScore: 100
  };

  const studentProfile: UserProfileData = {
    userId: 'student1',
    fullName: 'John Doe',
    departmentId: 'dept1',
    role: 'student'
  };

  const result = validateExamAttempt(attempt, studentProfile);

  if (result.success) {
    console.log('Validation successful!');
    console.log(`Student: ${result.data.studentId}`);
    console.log(`Department: ${result.data.departmentId}`);
    console.log(`Score: ${result.data.score}/${result.data.maxScore}`);
  } else {
    console.error('Validation failed:', formatParserError(result.error));
  }

  return result;
}

/**
 * Example 3: Batch validation with summary
 */
export function exampleBatchValidation() {
  const attempts: ExamAttemptData[] = [
    {
      attemptId: 'attempt1',
      examId: 'exam1',
      studentId: 'student1',
      isSubmitted: true,
      totalScore: 85,
      maxScore: 100
    },
    {
      attemptId: 'attempt2',
      examId: 'exam2',
      studentId: 'student1',
      isSubmitted: true,
      totalScore: null, // Invalid
      maxScore: 100
    },
    {
      attemptId: 'attempt3',
      examId: 'exam3',
      studentId: 'student1',
      isSubmitted: true,
      totalScore: -10, // Invalid
      maxScore: 100
    }
  ];

  const studentProfiles = new Map<string, UserProfileData>([
    ['student1', {
      userId: 'student1',
      fullName: 'John Doe',
      departmentId: 'dept1',
      role: 'student'
    }]
  ]);

  const summary = validateExamAttemptBatch(attempts, studentProfiles);

  console.log('Validation Summary:');
  console.log(`Total attempts: ${summary.totalAttempts}`);
  console.log(`Valid: ${summary.validCount}`);
  console.log(`Invalid: ${summary.invalidCount}`);
  console.log('\nError breakdown:');
  Object.entries(summary.errorSummary).forEach(([code, count]) => {
    if (count > 0) {
      console.log(`  ${code}: ${count}`);
    }
  });

  return summary;
}

/**
 * Example 4: Integration with leaderboard calculation
 * 
 * This shows how the parser would be used in the actual
 * leaderboard calculation function.
 */
export function exampleLeaderboardIntegration(
  attempts: ExamAttemptData[],
  studentProfiles: Map<string, UserProfileData>
) {
  // Step 1: Parse and validate exam attempts
  const { validAttempts, errors } = parseExamAttempts(attempts, studentProfiles);

  // Step 2: Log any errors for monitoring
  if (errors.length > 0) {
    console.warn(`Found ${errors.length} invalid exam attempts during parsing`);
    errors.forEach(({ attemptId, error }) => {
      console.warn(`  ${attemptId}: ${formatParserError(error)}`);
    });
  }

  // Step 3: Calculate statistics from valid attempts
  const studentStatsMap = new Map<string, {
    totalPoints: number;
    examCount: number;
  }>();

  validAttempts.forEach(attempt => {
    if (!studentStatsMap.has(attempt.studentId)) {
      studentStatsMap.set(attempt.studentId, {
        totalPoints: 0,
        examCount: 0
      });
    }

    const stats = studentStatsMap.get(attempt.studentId)!;
    stats.totalPoints += attempt.score;
    stats.examCount += 1;
  });

  // Step 4: Calculate averages and create rankings
  const rankings = Array.from(studentStatsMap.entries()).map(([studentId, stats]) => ({
    studentId,
    totalPoints: stats.totalPoints,
    averageScore: stats.totalPoints / stats.examCount,
    examCount: stats.examCount
  }));

  // Step 5: Sort by total points
  rankings.sort((a, b) => b.totalPoints - a.totalPoints);

  return {
    rankings,
    validAttemptCount: validAttempts.length,
    errorCount: errors.length
  };
}
