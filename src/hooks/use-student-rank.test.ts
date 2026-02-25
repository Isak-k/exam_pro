import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useStudentRank } from './use-student-rank';
import * as firebaseLeaderboard from '@/lib/firebase-leaderboard';
import { Timestamp } from 'firebase/firestore';

// Mock the firebase-leaderboard module
vi.mock('@/lib/firebase-leaderboard', () => ({
  getLeaderboard: vi.fn()
}));

describe('useStudentRank', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    vi.mocked(firebaseLeaderboard.getLeaderboard).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useStudentRank('dept-123', 'student-1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.rank).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should handle missing departmentId or studentId', async () => {
    const { result } = renderHook(() => useStudentRank(undefined, 'student-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Department ID and Student ID are required');
    expect(result.current.rank).toBeNull();
  });

  it('should fetch student rank successfully', async () => {
    const mockResponse = {
      entries: [
        {
          studentId: 'student-1',
          studentName: 'John Doe',
          departmentId: 'dept-123',
          totalPoints: 95,
          averageScore: 95,
          examCount: 2,
          rankPosition: 1
        },
        {
          studentId: 'student-2',
          studentName: 'Jane Smith',
          departmentId: 'dept-123',
          totalPoints: 90,
          averageScore: 90,
          examCount: 1,
          rankPosition: 2
        }
      ],
      totalStudents: 2,
      lastUpdated: Timestamp.fromDate(new Date()),
      departmentId: 'dept-123'
    };

    vi.mocked(firebaseLeaderboard.getLeaderboard).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useStudentRank('dept-123', 'student-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.rank).toBe(1);
    expect(result.current.totalPoints).toBe(95);
    expect(result.current.averageScore).toBe(95);
    expect(result.current.examCount).toBe(2);
    expect(result.current.error).toBeNull();
  });

  it('should handle student not found in leaderboard', async () => {
    const mockResponse = {
      entries: [
        {
          studentId: 'student-1',
          studentName: 'John Doe',
          departmentId: 'dept-123',
          totalPoints: 95,
          averageScore: 95,
          examCount: 1,
          rankPosition: 1
        }
      ],
      totalStudents: 1,
      lastUpdated: Timestamp.fromDate(new Date()),
      departmentId: 'dept-123'
    };

    vi.mocked(firebaseLeaderboard.getLeaderboard).mockResolvedValue(mockResponse);

    // Looking for student-2 who doesn't exist
    const { result } = renderHook(() => useStudentRank('dept-123', 'student-2'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.rank).toBeNull();
    expect(result.current.totalPoints).toBe(0);
    expect(result.current.averageScore).toBe(0);
    expect(result.current.examCount).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    vi.mocked(firebaseLeaderboard.getLeaderboard).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useStudentRank('dept-123', 'student-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.rank).toBeNull();
    expect(result.current.totalPoints).toBe(0);
    expect(result.current.averageScore).toBe(0);
    expect(result.current.examCount).toBe(0);
  });

  it('should refetch when studentId changes', async () => {
    const mockResponse = {
      entries: [
        {
          studentId: 'student-1',
          studentName: 'John Doe',
          departmentId: 'dept-123',
          totalPoints: 95,
          averageScore: 95,
          examCount: 2,
          rankPosition: 1
        },
        {
          studentId: 'student-2',
          studentName: 'Jane Smith',
          departmentId: 'dept-123',
          totalPoints: 90,
          averageScore: 90,
          examCount: 1,
          rankPosition: 2
        }
      ],
      totalStudents: 2,
      lastUpdated: Timestamp.fromDate(new Date()),
      departmentId: 'dept-123'
    };

    vi.mocked(firebaseLeaderboard.getLeaderboard).mockResolvedValue(mockResponse);

    const { result, rerender } = renderHook(
      ({ studentId }) => useStudentRank('dept-123', studentId),
      { initialProps: { studentId: 'student-1' } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.rank).toBe(1);
    expect(result.current.totalPoints).toBe(95);

    // Change student ID
    rerender({ studentId: 'student-2' });

    await waitFor(() => {
      expect(result.current.rank).toBe(2);
      expect(result.current.totalPoints).toBe(90);
    });
  });

  it('should support manual refetch', async () => {
    const mockResponse = {
      entries: [
        {
          studentId: 'student-1',
          studentName: 'John Doe',
          departmentId: 'dept-123',
          totalPoints: 95,
          averageScore: 95,
          examCount: 1,
          rankPosition: 1
        }
      ],
      totalStudents: 1,
      lastUpdated: Timestamp.fromDate(new Date()),
      departmentId: 'dept-123'
    };

    vi.mocked(firebaseLeaderboard.getLeaderboard).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useStudentRank('dept-123', 'student-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should have called getLeaderboard twice (initial + refetch)
    expect(firebaseLeaderboard.getLeaderboard).toHaveBeenCalledTimes(2);
  });

  it('should handle empty leaderboard', async () => {
    const mockResponse = {
      entries: [],
      totalStudents: 0,
      lastUpdated: Timestamp.fromDate(new Date()),
      departmentId: 'dept-123'
    };

    vi.mocked(firebaseLeaderboard.getLeaderboard).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useStudentRank('dept-123', 'student-1'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.rank).toBeNull();
    expect(result.current.totalPoints).toBe(0);
    expect(result.current.averageScore).toBe(0);
    expect(result.current.examCount).toBe(0);
    expect(result.current.error).toBeNull();
  });

  it('should find student in middle of leaderboard', async () => {
    const mockResponse = {
      entries: [
        {
          studentId: 'student-1',
          studentName: 'First Place',
          departmentId: 'dept-123',
          totalPoints: 100,
          averageScore: 100,
          examCount: 1,
          rankPosition: 1
        },
        {
          studentId: 'student-2',
          studentName: 'Second Place',
          departmentId: 'dept-123',
          totalPoints: 95,
          averageScore: 95,
          examCount: 1,
          rankPosition: 2
        },
        {
          studentId: 'student-3',
          studentName: 'Third Place',
          departmentId: 'dept-123',
          totalPoints: 90,
          averageScore: 90,
          examCount: 1,
          rankPosition: 3
        }
      ],
      totalStudents: 3,
      lastUpdated: Timestamp.fromDate(new Date()),
      departmentId: 'dept-123'
    };

    vi.mocked(firebaseLeaderboard.getLeaderboard).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useStudentRank('dept-123', 'student-2'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.rank).toBe(2);
    expect(result.current.totalPoints).toBe(95);
    expect(result.current.averageScore).toBe(95);
  });
});
