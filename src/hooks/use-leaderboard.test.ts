import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useLeaderboard } from './use-leaderboard';
import * as firebaseLeaderboard from '@/lib/firebase-leaderboard';
import { Timestamp } from 'firebase/firestore';

// Mock the firebase-leaderboard module
vi.mock('@/lib/firebase-leaderboard', () => ({
  getLeaderboard: vi.fn(),
  calculateDepartmentLeaderboard: vi.fn()
}));

describe('useLeaderboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    vi.mocked(firebaseLeaderboard.getLeaderboard).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useLeaderboard('dept-123'));

    expect(result.current.loading).toBe(true);
    expect(result.current.entries).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should handle missing departmentId', async () => {
    const { result } = renderHook(() => useLeaderboard(undefined));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Department ID is required');
    expect(result.current.entries).toEqual([]);
  });

  it('should fetch leaderboard data successfully', async () => {
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
      lastUpdated: Timestamp.fromDate(new Date('2024-01-01')),
      departmentId: 'dept-123'
    };

    vi.mocked(firebaseLeaderboard.getLeaderboard).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLeaderboard('dept-123'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.entries).toHaveLength(2);
    expect(result.current.entries[0].studentName).toBe('John Doe');
    expect(result.current.entries[1].studentName).toBe('Jane Smith');
    expect(result.current.totalStudents).toBe(2);
    expect(result.current.error).toBeNull();
    expect(result.current.lastUpdated).toBeInstanceOf(Date);
  });

  it('should handle fetch errors', async () => {
    vi.mocked(firebaseLeaderboard.getLeaderboard).mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useLeaderboard('dept-123'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.entries).toEqual([]);
    expect(result.current.totalStudents).toBe(0);
  });

  it('should refetch data when departmentId changes', async () => {
    const mockResponse1 = {
      entries: [
        {
          studentId: 'student-1',
          studentName: 'Dept 1 Student',
          departmentId: 'dept-1',
          totalPoints: 95,
          averageScore: 95,
          examCount: 1,
          rankPosition: 1
        }
      ],
      totalStudents: 1,
      lastUpdated: Timestamp.fromDate(new Date()),
      departmentId: 'dept-1'
    };

    const mockResponse2 = {
      entries: [
        {
          studentId: 'student-2',
          studentName: 'Dept 2 Student',
          departmentId: 'dept-2',
          totalPoints: 90,
          averageScore: 90,
          examCount: 1,
          rankPosition: 1
        }
      ],
      totalStudents: 1,
      lastUpdated: Timestamp.fromDate(new Date()),
      departmentId: 'dept-2'
    };

    vi.mocked(firebaseLeaderboard.getLeaderboard)
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);

    const { result, rerender } = renderHook(
      ({ deptId }) => useLeaderboard(deptId),
      { initialProps: { deptId: 'dept-1' } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.entries[0].studentName).toBe('Dept 1 Student');

    // Change department ID
    rerender({ deptId: 'dept-2' });

    await waitFor(() => {
      expect(result.current.entries[0].studentName).toBe('Dept 2 Student');
    });

    expect(firebaseLeaderboard.getLeaderboard).toHaveBeenCalledTimes(2);
  });

  it('should support manual refetch with force refresh', async () => {
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
    vi.mocked(firebaseLeaderboard.calculateDepartmentLeaderboard).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLeaderboard('dept-123'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Call refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Refetch should call calculateDepartmentLeaderboard with forceRefresh=true
    expect(firebaseLeaderboard.calculateDepartmentLeaderboard).toHaveBeenCalledWith(
      'dept-123',
      true,
      50,
      0
    );
  });

  it('should handle empty leaderboard', async () => {
    const mockResponse = {
      entries: [],
      totalStudents: 0,
      lastUpdated: Timestamp.fromDate(new Date()),
      departmentId: 'dept-123'
    };

    vi.mocked(firebaseLeaderboard.getLeaderboard).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLeaderboard('dept-123'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.entries).toEqual([]);
    expect(result.current.totalStudents).toBe(0);
    expect(result.current.error).toBeNull();
  });
});
