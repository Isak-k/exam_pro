import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  calculateDepartmentLeaderboard, 
  getCachedLeaderboard,
  getLeaderboard 
} from './firebase-leaderboard';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Mock Firebase functions
vi.mock('firebase/functions', () => ({
  getFunctions: vi.fn(),
  httpsCallable: vi.fn()
}));

// Mock Firebase firestore
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn()
}));

describe('firebase-leaderboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateDepartmentLeaderboard', () => {
    it('should throw error if departmentId is empty', async () => {
      await expect(calculateDepartmentLeaderboard('')).rejects.toThrow(
        'departmentId is required'
      );
    });

    it('should call Firebase function with correct parameters', async () => {
      const mockCallable = vi.fn().mockResolvedValue({
        data: {
          entries: [],
          totalStudents: 0,
          lastUpdated: { seconds: 0, nanoseconds: 0 },
          departmentId: 'dept-123'
        }
      });

      vi.mocked(httpsCallable).mockReturnValue(mockCallable);
      vi.mocked(getFunctions).mockReturnValue({} as any);

      const result = await calculateDepartmentLeaderboard('dept-123');

      expect(getFunctions).toHaveBeenCalled();
      expect(httpsCallable).toHaveBeenCalledWith(
        expect.anything(),
        'calculateDepartmentLeaderboard'
      );
      expect(mockCallable).toHaveBeenCalledWith({ 
        departmentId: 'dept-123',
        forceRefresh: false 
      });
      expect(result.departmentId).toBe('dept-123');
    });

    it('should support forceRefresh parameter', async () => {
      const mockCallable = vi.fn().mockResolvedValue({
        data: {
          entries: [],
          totalStudents: 0,
          lastUpdated: { seconds: 0, nanoseconds: 0 },
          departmentId: 'dept-123'
        }
      });

      vi.mocked(httpsCallable).mockReturnValue(mockCallable);
      vi.mocked(getFunctions).mockReturnValue({} as any);

      await calculateDepartmentLeaderboard('dept-123', true);

      expect(mockCallable).toHaveBeenCalledWith({ 
        departmentId: 'dept-123',
        forceRefresh: true 
      });
    });

    it('should return leaderboard response with entries', async () => {
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
        lastUpdated: { seconds: 0, nanoseconds: 0 },
        departmentId: 'dept-123'
      };

      const mockCallable = vi.fn().mockResolvedValue({ data: mockResponse });
      vi.mocked(httpsCallable).mockReturnValue(mockCallable);
      vi.mocked(getFunctions).mockReturnValue({} as any);

      const result = await calculateDepartmentLeaderboard('dept-123');

      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].studentName).toBe('John Doe');
      expect(result.entries[0].rankPosition).toBe(1);
      expect(result.totalStudents).toBe(1);
    });

    it('should handle function call errors', async () => {
      const mockCallable = vi.fn().mockRejectedValue(new Error('Network error'));
      vi.mocked(httpsCallable).mockReturnValue(mockCallable);
      vi.mocked(getFunctions).mockReturnValue({} as any);

      await expect(calculateDepartmentLeaderboard('dept-123')).rejects.toThrow(
        'Failed to calculate leaderboard'
      );
    });
  });

  describe('getCachedLeaderboard', () => {
    it('should throw error if departmentId is empty', async () => {
      await expect(getCachedLeaderboard('')).rejects.toThrow(
        'departmentId is required'
      );
    });

    it('should return null if cache does not exist', async () => {
      const mockDocSnapshot = {
        exists: () => false
      };

      vi.mocked(getDoc).mockResolvedValue(mockDocSnapshot as any);
      vi.mocked(getFirestore).mockReturnValue({} as any);
      vi.mocked(doc).mockReturnValue({} as any);

      const result = await getCachedLeaderboard('dept-123');

      expect(result).toBeNull();
    });

    it('should return null if cache has expired', async () => {
      const expiredTime = Date.now() - 1000; // 1 second ago
      const mockDocSnapshot = {
        exists: () => true,
        data: () => ({
          departmentId: 'dept-123',
          entries: [],
          totalStudents: 0,
          lastUpdated: { seconds: 0, nanoseconds: 0 },
          expiresAt: { toMillis: () => expiredTime }
        })
      };

      vi.mocked(getDoc).mockResolvedValue(mockDocSnapshot as any);
      vi.mocked(getFirestore).mockReturnValue({} as any);
      vi.mocked(doc).mockReturnValue({} as any);

      const result = await getCachedLeaderboard('dept-123');

      expect(result).toBeNull();
    });

    it('should return cached data if valid', async () => {
      const futureTime = Date.now() + 600000; // 10 minutes from now
      const mockDocSnapshot = {
        exists: () => true,
        data: () => ({
          departmentId: 'dept-123',
          entries: [
            {
              studentId: 'student-1',
              studentName: 'Jane Doe',
              departmentId: 'dept-123',
              totalPoints: 100,
              averageScore: 100,
              examCount: 1,
              rankPosition: 1
            }
          ],
          totalStudents: 1,
          lastUpdated: { seconds: 0, nanoseconds: 0 },
          expiresAt: { toMillis: () => futureTime }
        })
      };

      vi.mocked(getDoc).mockResolvedValue(mockDocSnapshot as any);
      vi.mocked(getFirestore).mockReturnValue({} as any);
      vi.mocked(doc).mockReturnValue({} as any);

      const result = await getCachedLeaderboard('dept-123');

      expect(result).not.toBeNull();
      expect(result?.entries).toHaveLength(1);
      expect(result?.entries[0].studentName).toBe('Jane Doe');
      expect(result?.totalStudents).toBe(1);
    });

    it('should handle errors gracefully', async () => {
      vi.mocked(getDoc).mockRejectedValue(new Error('Firestore error'));
      vi.mocked(getFirestore).mockReturnValue({} as any);
      vi.mocked(doc).mockReturnValue({} as any);

      const result = await getCachedLeaderboard('dept-123');

      expect(result).toBeNull();
    });
  });

  describe('getLeaderboard', () => {
    it('should return cached data if available', async () => {
      const futureTime = Date.now() + 600000;
      const mockDocSnapshot = {
        exists: () => true,
        data: () => ({
          departmentId: 'dept-123',
          entries: [
            {
              studentId: 'student-1',
              studentName: 'Cached User',
              departmentId: 'dept-123',
              totalPoints: 90,
              averageScore: 90,
              examCount: 1,
              rankPosition: 1
            }
          ],
          totalStudents: 1,
          lastUpdated: { seconds: 0, nanoseconds: 0 },
          expiresAt: { toMillis: () => futureTime }
        })
      };

      vi.mocked(getDoc).mockResolvedValue(mockDocSnapshot as any);
      vi.mocked(getFirestore).mockReturnValue({} as any);
      vi.mocked(doc).mockReturnValue({} as any);

      const result = await getLeaderboard('dept-123');

      expect(result.entries[0].studentName).toBe('Cached User');
      // Should not call the Cloud Function
      expect(httpsCallable).not.toHaveBeenCalled();
    });

    it('should fallback to Cloud Function if cache is invalid', async () => {
      const mockDocSnapshot = {
        exists: () => false
      };

      const mockCallable = vi.fn().mockResolvedValue({
        data: {
          entries: [
            {
              studentId: 'student-1',
              studentName: 'Fresh User',
              departmentId: 'dept-123',
              totalPoints: 85,
              averageScore: 85,
              examCount: 1,
              rankPosition: 1
            }
          ],
          totalStudents: 1,
          lastUpdated: { seconds: 0, nanoseconds: 0 },
          departmentId: 'dept-123'
        }
      });

      vi.mocked(getDoc).mockResolvedValue(mockDocSnapshot as any);
      vi.mocked(getFirestore).mockReturnValue({} as any);
      vi.mocked(doc).mockReturnValue({} as any);
      vi.mocked(httpsCallable).mockReturnValue(mockCallable);
      vi.mocked(getFunctions).mockReturnValue({} as any);

      const result = await getLeaderboard('dept-123');

      expect(result.entries[0].studentName).toBe('Fresh User');
      expect(httpsCallable).toHaveBeenCalled();
    });
  });
});
