/**
 * Ranking Data Parser Functions
 * 
 * Requirements: 8.1, 8.5, 8.6
 * 
 * This module provides utility functions for parsing exam attempt data
 * into ranking calculations with validation and error handling.
 */

import { ExamAttemptData, UserProfileData } from './types';

/**
 * Error types for ranking parser
 */
export type RankingParserErrorCode =
  | 'MISSING_STUDENT_ID'
  | 'MISSING_DEPARTMENT_ID'
  | 'MISSING_SCORE'
  | 'INVALID_SCORE'
  | 'INVALID_EXAM_DATA'
  | 'MISSING_REQUIRED_FIELD';

export interface RankingParserError {
  code: RankingParserErrorCode;
  message: string;
  field?: string;
  value?: unknown;
}

/**
 * Result type for parsing operations
 */
export type ParseResult<T> = 
  | { success: true; data: T }
  | { success: false; error: RankingParserError };

/**
 * Validated exam attempt with required fields
 */
export interface ValidatedExamAttempt {
  studentId: string;
  departmentId: string;
  score: number;
  maxScore: number;
  examId: string;
  attemptId: string;
}

/**
 * Validate that an exam attempt has all required fields
 * Requirements: 8.6
 * 
 * @param attempt - The exam attempt to validate
 * @param studentProfile - The student profile containing departmentId
 * @returns ParseResult with validated data or error
 */
export function validateExamAttempt(
  attempt: ExamAttemptData,
  studentProfile: UserProfileData
): ParseResult<ValidatedExamAttempt> {
  // Requirement 8.6: Validate studentId is present
  if (!attempt.studentId || typeof attempt.studentId !== 'string') {
    return {
      success: false,
      error: {
        code: 'MISSING_STUDENT_ID',
        message: 'studentId is required and must be a non-empty string',
        field: 'studentId',
        value: attempt.studentId
      }
    };
  }

  // Requirement 8.6: Validate departmentId is present
  if (!studentProfile.departmentId || typeof studentProfile.departmentId !== 'string') {
    return {
      success: false,
      error: {
        code: 'MISSING_DEPARTMENT_ID',
        message: 'departmentId is required and must be a non-empty string',
        field: 'departmentId',
        value: studentProfile.departmentId
      }
    };
  }

  // Requirement 8.6: Validate score is present
  if (attempt.totalScore === null || attempt.totalScore === undefined) {
    return {
      success: false,
      error: {
        code: 'MISSING_SCORE',
        message: 'totalScore is required and cannot be null',
        field: 'totalScore',
        value: attempt.totalScore
      }
    };
  }

  // Validate score is a valid number
  if (typeof attempt.totalScore !== 'number' || isNaN(attempt.totalScore)) {
    return {
      success: false,
      error: {
        code: 'INVALID_SCORE',
        message: 'totalScore must be a valid number',
        field: 'totalScore',
        value: attempt.totalScore
      }
    };
  }

  // Validate maxScore is present and valid
  if (attempt.maxScore === null || attempt.maxScore === undefined) {
    return {
      success: false,
      error: {
        code: 'MISSING_SCORE',
        message: 'maxScore is required and cannot be null',
        field: 'maxScore',
        value: attempt.maxScore
      }
    };
  }

  if (typeof attempt.maxScore !== 'number' || isNaN(attempt.maxScore) || attempt.maxScore <= 0) {
    return {
      success: false,
      error: {
        code: 'INVALID_SCORE',
        message: 'maxScore must be a valid positive number',
        field: 'maxScore',
        value: attempt.maxScore
      }
    };
  }

  // Validate score is not negative
  if (attempt.totalScore < 0) {
    return {
      success: false,
      error: {
        code: 'INVALID_SCORE',
        message: 'totalScore cannot be negative',
        field: 'totalScore',
        value: attempt.totalScore
      }
    };
  }

  // Validate examId is present
  if (!attempt.examId || typeof attempt.examId !== 'string') {
    return {
      success: false,
      error: {
        code: 'MISSING_REQUIRED_FIELD',
        message: 'examId is required and must be a non-empty string',
        field: 'examId',
        value: attempt.examId
      }
    };
  }

  // Validate attemptId is present
  if (!attempt.attemptId || typeof attempt.attemptId !== 'string') {
    return {
      success: false,
      error: {
        code: 'MISSING_REQUIRED_FIELD',
        message: 'attemptId is required and must be a non-empty string',
        field: 'attemptId',
        value: attempt.attemptId
      }
    };
  }

  // All validations passed
  return {
    success: true,
    data: {
      studentId: attempt.studentId,
      departmentId: studentProfile.departmentId,
      score: attempt.totalScore,
      maxScore: attempt.maxScore,
      examId: attempt.examId,
      attemptId: attempt.attemptId
    }
  };
}

/**
 * Parse exam attempts into ranking calculations
 * Requirements: 8.1, 8.5
 * 
 * This function filters and validates exam attempts, returning only
 * valid attempts that can be used for ranking calculations.
 * 
 * @param attempts - Array of exam attempts to parse
 * @param studentProfiles - Map of student profiles by studentId
 * @returns Object containing valid attempts and errors encountered
 */
export function parseExamAttempts(
  attempts: ExamAttemptData[],
  studentProfiles: Map<string, UserProfileData>
): {
  validAttempts: ValidatedExamAttempt[];
  errors: Array<{ attemptId: string; error: RankingParserError }>;
} {
  const validAttempts: ValidatedExamAttempt[] = [];
  const errors: Array<{ attemptId: string; error: RankingParserError }> = [];

  for (const attempt of attempts) {
    // Skip attempts that are not submitted
    if (!attempt.isSubmitted) {
      continue;
    }

    // Get student profile
    const studentProfile = studentProfiles.get(attempt.studentId);
    
    if (!studentProfile) {
      // Requirement 8.5: Return descriptive error messages
      errors.push({
        attemptId: attempt.attemptId || 'unknown',
        error: {
          code: 'INVALID_EXAM_DATA',
          message: `Student profile not found for studentId: ${attempt.studentId}`,
          field: 'studentId',
          value: attempt.studentId
        }
      });
      continue;
    }

    // Validate the attempt
    const validationResult = validateExamAttempt(attempt, studentProfile);

    if (!validationResult.success) {
      // Requirement 8.5: Return descriptive error messages
      errors.push({
        attemptId: attempt.attemptId || 'unknown',
        error: validationResult.error
      });
      continue;
    }

    // Add to valid attempts
    validAttempts.push(validationResult.data);
  }

  return {
    validAttempts,
    errors
  };
}

/**
 * Create a descriptive error message from a RankingParserError
 * Requirements: 8.5
 * 
 * @param error - The error object
 * @returns A human-readable error message
 */
export function formatParserError(error: RankingParserError): string {
  let message = `[${error.code}] ${error.message}`;
  
  if (error.field) {
    message += ` (field: ${error.field})`;
  }
  
  if (error.value !== undefined) {
    message += ` (value: ${JSON.stringify(error.value)})`;
  }
  
  return message;
}

/**
 * Validate a batch of exam attempts and return summary
 * Requirements: 8.5, 8.6
 * 
 * @param attempts - Array of exam attempts to validate
 * @param studentProfiles - Map of student profiles by studentId
 * @returns Summary of validation results
 */
export function validateExamAttemptBatch(
  attempts: ExamAttemptData[],
  studentProfiles: Map<string, UserProfileData>
): {
  totalAttempts: number;
  validCount: number;
  invalidCount: number;
  errors: Array<{ attemptId: string; error: RankingParserError }>;
  errorSummary: Record<RankingParserErrorCode, number>;
} {
  const result = parseExamAttempts(attempts, studentProfiles);
  
  // Count errors by type
  const errorSummary: Record<RankingParserErrorCode, number> = {
    MISSING_STUDENT_ID: 0,
    MISSING_DEPARTMENT_ID: 0,
    MISSING_SCORE: 0,
    INVALID_SCORE: 0,
    INVALID_EXAM_DATA: 0,
    MISSING_REQUIRED_FIELD: 0
  };
  
  result.errors.forEach(({ error }) => {
    errorSummary[error.code] = (errorSummary[error.code] || 0) + 1;
  });
  
  return {
    totalAttempts: attempts.length,
    validCount: result.validAttempts.length,
    invalidCount: result.errors.length,
    errors: result.errors,
    errorSummary
  };
}
