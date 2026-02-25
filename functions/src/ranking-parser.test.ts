/**
 * Unit tests for ranking parser functions
 * Requirements: 8.1, 8.5, 8.6
 */

import {
  validateExamAttempt,
  parseExamAttempts,
  formatParserError,
  validateExamAttemptBatch,
  RankingParserError
} from './ranking-parser';
import { ExamAttemptData, UserProfileData } from './types';

describe('Ranking Parser', () => {
  describe('validateExamAttempt', () => {
    const validStudentProfile: UserProfileData = {
      userId: 'student1',
      fullName: 'John Doe',
      departmentId: 'dept1',
      role: 'student'
    };

    const validAttempt: ExamAttemptData = {
      attemptId: 'attempt1',
      examId: 'exam1',
      studentId: 'student1',
      isSubmitted: true,
      totalScore: 85,
      maxScore: 100
    };

    it('should validate a correct exam attempt', () => {
      const result = validateExamAttempt(validAttempt, validStudentProfile);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.studentId).toBe('student1');
        expect(result.data.departmentId).toBe('dept1');
        expect(result.data.score).toBe(85);
        expect(result.data.maxScore).toBe(100);
        expect(result.data.examId).toBe('exam1');
        expect(result.data.attemptId).toBe('attempt1');
      }
    });

    it('should reject attempt with missing studentId', () => {
      const invalidAttempt = { ...validAttempt, studentId: '' };
      const result = validateExamAttempt(invalidAttempt, validStudentProfile);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('MISSING_STUDENT_ID');
        expect(result.error.message).toContain('studentId is required');
      }
    });

    it('should reject attempt with missing departmentId', () => {
      const invalidProfile = { ...validStudentProfile, departmentId: undefined };
      const result = validateExamAttempt(validAttempt, invalidProfile);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('MISSING_DEPARTMENT_ID');
        expect(result.error.message).toContain('departmentId is required');
      }
    });

    it('should reject attempt with null totalScore', () => {
      const invalidAttempt = { ...validAttempt, totalScore: null };
      const result = validateExamAttempt(invalidAttempt, validStudentProfile);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('MISSING_SCORE');
        expect(result.error.message).toContain('totalScore is required');
      }
    });

    it('should reject attempt with invalid totalScore', () => {
      const invalidAttempt = { ...validAttempt, totalScore: NaN };
      const result = validateExamAttempt(invalidAttempt, validStudentProfile);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('INVALID_SCORE');
        expect(result.error.message).toContain('must be a valid number');
      }
    });

    it('should reject attempt with negative totalScore', () => {
      const invalidAttempt = { ...validAttempt, totalScore: -10 };
      const result = validateExamAttempt(invalidAttempt, validStudentProfile);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('INVALID_SCORE');
        expect(result.error.message).toContain('cannot be negative');
      }
    });

    it('should reject attempt with null maxScore', () => {
      const invalidAttempt = { ...validAttempt, maxScore: null };
      const result = validateExamAttempt(invalidAttempt, validStudentProfile);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('MISSING_SCORE');
        expect(result.error.message).toContain('maxScore is required');
      }
    });

    it('should reject attempt with zero maxScore', () => {
      const invalidAttempt = { ...validAttempt, maxScore: 0 };
      const result = validateExamAttempt(invalidAttempt, validStudentProfile);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('INVALID_SCORE');
        expect(result.error.message).toContain('must be a valid positive number');
      }
    });

    it('should reject attempt with missing examId', () => {
      const invalidAttempt = { ...validAttempt, examId: '' };
      const result = validateExamAttempt(invalidAttempt, validStudentProfile);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('MISSING_REQUIRED_FIELD');
        expect(result.error.message).toContain('examId is required');
      }
    });

    it('should reject attempt with missing attemptId', () => {
      const invalidAttempt = { ...validAttempt, attemptId: '' };
      const result = validateExamAttempt(invalidAttempt, validStudentProfile);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe('MISSING_REQUIRED_FIELD');
        expect(result.error.message).toContain('attemptId is required');
      }
    });

    it('should accept attempt with zero totalScore', () => {
      const zeroScoreAttempt = { ...validAttempt, totalScore: 0 };
      const result = validateExamAttempt(zeroScoreAttempt, validStudentProfile);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.score).toBe(0);
      }
    });
  });

  describe('parseExamAttempts', () => {
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
        departmentId: 'dept2',
        role: 'student'
      }]
    ]);

    it('should parse valid exam attempts', () => {
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

      const result = parseExamAttempts(attempts, studentProfiles);
      
      expect(result.validAttempts).toHaveLength(2);
      expect(result.errors).toHaveLength(0);
      expect(result.validAttempts[0].studentId).toBe('student1');
      expect(result.validAttempts[1].studentId).toBe('student2');
    });

    it('should skip non-submitted attempts', () => {
      const attempts: ExamAttemptData[] = [
        {
          attemptId: 'attempt1',
          examId: 'exam1',
          studentId: 'student1',
          isSubmitted: false,
          totalScore: 85,
          maxScore: 100
        }
      ];

      const result = parseExamAttempts(attempts, studentProfiles);
      
      expect(result.validAttempts).toHaveLength(0);
      expect(result.errors).toHaveLength(0);
    });

    it('should collect errors for invalid attempts', () => {
      const attempts: ExamAttemptData[] = [
        {
          attemptId: 'attempt1',
          examId: 'exam1',
          studentId: 'student1',
          isSubmitted: true,
          totalScore: null,
          maxScore: 100
        },
        {
          attemptId: 'attempt2',
          examId: 'exam2',
          studentId: 'student2',
          isSubmitted: true,
          totalScore: -10,
          maxScore: 100
        }
      ];

      const result = parseExamAttempts(attempts, studentProfiles);
      
      expect(result.validAttempts).toHaveLength(0);
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0].error.code).toBe('MISSING_SCORE');
      expect(result.errors[1].error.code).toBe('INVALID_SCORE');
    });

    it('should handle missing student profiles', () => {
      const attempts: ExamAttemptData[] = [
        {
          attemptId: 'attempt1',
          examId: 'exam1',
          studentId: 'student999',
          isSubmitted: true,
          totalScore: 85,
          maxScore: 100
        }
      ];

      const result = parseExamAttempts(attempts, studentProfiles);
      
      expect(result.validAttempts).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].error.code).toBe('INVALID_EXAM_DATA');
      expect(result.errors[0].error.message).toContain('Student profile not found');
    });

    it('should handle mixed valid and invalid attempts', () => {
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
          totalScore: null,
          maxScore: 100
        },
        {
          attemptId: 'attempt3',
          examId: 'exam3',
          studentId: 'student1',
          isSubmitted: true,
          totalScore: 75,
          maxScore: 100
        }
      ];

      const result = parseExamAttempts(attempts, studentProfiles);
      
      expect(result.validAttempts).toHaveLength(2);
      expect(result.errors).toHaveLength(1);
      expect(result.validAttempts[0].attemptId).toBe('attempt1');
      expect(result.validAttempts[1].attemptId).toBe('attempt3');
    });
  });

  describe('formatParserError', () => {
    it('should format error with all fields', () => {
      const error: RankingParserError = {
        code: 'MISSING_SCORE',
        message: 'totalScore is required',
        field: 'totalScore',
        value: null
      };

      const formatted = formatParserError(error);
      
      expect(formatted).toContain('[MISSING_SCORE]');
      expect(formatted).toContain('totalScore is required');
      expect(formatted).toContain('field: totalScore');
      expect(formatted).toContain('value: null');
    });

    it('should format error without optional fields', () => {
      const error: RankingParserError = {
        code: 'INVALID_EXAM_DATA',
        message: 'Student profile not found'
      };

      const formatted = formatParserError(error);
      
      expect(formatted).toContain('[INVALID_EXAM_DATA]');
      expect(formatted).toContain('Student profile not found');
      expect(formatted).not.toContain('field:');
      expect(formatted).not.toContain('value:');
    });
  });

  describe('validateExamAttemptBatch', () => {
    const studentProfiles = new Map<string, UserProfileData>([
      ['student1', {
        userId: 'student1',
        fullName: 'John Doe',
        departmentId: 'dept1',
        role: 'student'
      }]
    ]);

    it('should provide summary of validation results', () => {
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
          totalScore: null,
          maxScore: 100
        },
        {
          attemptId: 'attempt3',
          examId: 'exam3',
          studentId: 'student1',
          isSubmitted: true,
          totalScore: -10,
          maxScore: 100
        }
      ];

      const summary = validateExamAttemptBatch(attempts, studentProfiles);
      
      expect(summary.totalAttempts).toBe(3);
      expect(summary.validCount).toBe(1);
      expect(summary.invalidCount).toBe(2);
      expect(summary.errorSummary.MISSING_SCORE).toBe(1);
      expect(summary.errorSummary.INVALID_SCORE).toBe(1);
    });

    it('should handle all valid attempts', () => {
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
          totalScore: 90,
          maxScore: 100
        }
      ];

      const summary = validateExamAttemptBatch(attempts, studentProfiles);
      
      expect(summary.totalAttempts).toBe(2);
      expect(summary.validCount).toBe(2);
      expect(summary.invalidCount).toBe(0);
    });

    it('should handle all invalid attempts', () => {
      const attempts: ExamAttemptData[] = [
        {
          attemptId: 'attempt1',
          examId: 'exam1',
          studentId: 'student1',
          isSubmitted: true,
          totalScore: null,
          maxScore: 100
        },
        {
          attemptId: 'attempt2',
          examId: 'exam2',
          studentId: 'student999',
          isSubmitted: true,
          totalScore: 90,
          maxScore: 100
        }
      ];

      const summary = validateExamAttemptBatch(attempts, studentProfiles);
      
      expect(summary.totalAttempts).toBe(2);
      expect(summary.validCount).toBe(0);
      expect(summary.invalidCount).toBe(2);
      expect(summary.errorSummary.MISSING_SCORE).toBe(1);
      expect(summary.errorSummary.INVALID_EXAM_DATA).toBe(1);
    });
  });
});
