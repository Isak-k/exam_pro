import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFunctions, httpsCallable } from 'firebase/functions';
import {
  adminRefreshLeaderboardCache,
  adminRecalculateRankings,
  adminResetLeaderboard,
  adminGetLeaderboardStatus
} from './firebase-leaderboard';

// Mock Firebase functions
vi.mock('firebase/functions', () => ({
  getFunctions: vi.fn(),
  httpsCallable: vi.fn()
}));

describe('Admin Leaderboard Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('adminRefreshLeaderboardCache', () => {
    it('should refresh cache for a specific department', async () => {
      const mockCallable = vi.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Cache refreshed for department: dept1',
          departmentId: 'dept1',
          totalStudents: 10,
          timestamp: { seconds: 1234567890 }
        }
      });

      vi.mocked(httpsCallable).mockReturnValue(mockCallable as any);

      const result = await adminRefreshLeaderboardCache('dept1');

      expect(result.success).toBe(true);
      expect(result.departmentId).toBe('dept1');
      expect(result.totalStudents).toBe(10);
      expect(mockCallable).toHaveBeenCalledWith({ departmentId: 'dept1' });
    });

    it('should refresh cache for all departments when no departmentId provided', async () => {
      const mockCallable = vi.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Cache refreshed for 3 of 3 departments',
          refreshedCount: 3,
          totalDepartments: 3,
          results: [
            { departmentId: 'dept1', success: true, totalStudents: 10 },
            { departmentId: 'dept2', success: true, totalStudents: 15 },
            { departmentId: 'dept3', success: true, totalStudents: 8 }
          ],
          timestamp: { seconds: 1234567890 }
        }
      });

      vi.mocked(httpsCallable).mockReturnValue(mockCallable as any);

      const result = await adminRefreshLeaderboardCache();

      expect(result.success).toBe(true);
      expect(result.refreshedCount).toBe(3);
      expect(result.totalDepartments).toBe(3);
      expect(result.results).toHaveLength(3);
      expect(mockCallable).toHaveBeenCalledWith({ departmentId: undefined });
    });

    it('should handle errors when refreshing cache', async () => {
      const mockCallable = vi.fn().mockRejectedValue(new Error('Permission denied'));

      vi.mocked(httpsCallable).mockReturnValue(mockCallable as any);

      await expect(adminRefreshLeaderboardCache('dept1')).rejects.toThrow(
        'Failed to refresh leaderboard cache: Permission denied'
      );
    });
  });

  describe('adminRecalculateRankings', () => {
    it('should recalculate rankings for all departments', async () => {
      const mockCallable = vi.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Rankings recalculated for 3 of 3 departments',
          recalculatedCount: 3,
          totalDepartments: 3,
          totalStudents: 33,
          results: [
            { departmentId: 'dept1', success: true, totalStudents: 10, entriesCount: 10 },
            { departmentId: 'dept2', success: true, totalStudents: 15, entriesCount: 15 },
            { departmentId: 'dept3', success: true, totalStudents: 8, entriesCount: 8 }
          ],
          timestamp: { seconds: 1234567890 }
        }
      });

      vi.mocked(httpsCallable).mockReturnValue(mockCallable as any);

      const result = await adminRecalculateRankings();

      expect(result.success).toBe(true);
      expect(result.recalculatedCount).toBe(3);
      expect(result.totalDepartments).toBe(3);
      expect(result.totalStudents).toBe(33);
      expect(result.results).toHaveLength(3);
      expect(mockCallable).toHaveBeenCalledWith({});
    });

    it('should handle partial failures when recalculating rankings', async () => {
      const mockCallable = vi.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Rankings recalculated for 2 of 3 departments',
          recalculatedCount: 2,
          totalDepartments: 3,
          totalStudents: 25,
          results: [
            { departmentId: 'dept1', success: true, totalStudents: 10, entriesCount: 10 },
            { departmentId: 'dept2', success: true, totalStudents: 15, entriesCount: 15 },
            { departmentId: 'dept3', success: false, error: 'Database error' }
          ],
          timestamp: { seconds: 1234567890 }
        }
      });

      vi.mocked(httpsCallable).mockReturnValue(mockCallable as any);

      const result = await adminRecalculateRankings();

      expect(result.success).toBe(true);
      expect(result.recalculatedCount).toBe(2);
      expect(result.totalDepartments).toBe(3);
      expect(result.results[2].success).toBe(false);
    });

    it('should handle errors when recalculating rankings', async () => {
      const mockCallable = vi.fn().mockRejectedValue(new Error('Internal error'));

      vi.mocked(httpsCallable).mockReturnValue(mockCallable as any);

      await expect(adminRecalculateRankings()).rejects.toThrow(
        'Failed to recalculate rankings: Internal error'
      );
    });
  });

  describe('adminResetLeaderboard', () => {
    it('should reset leaderboard for a specific department', async () => {
      const mockCallable = vi.fn().mockResolvedValue({
        data: {
          success: true,
          message: 'Leaderboard cache cleared for department: dept1',
          departmentId: 'dept1',
          timestamp: { seconds: 1234567890 }
        }
      });

      vi.mocked(httpsCallable).mockReturnValue(mockCallable as any);

      const result = await adminResetLeaderboard('dept1');

      expect(result.success).toBe(true);
      expect(result.departmentId).toBe('dept1');
      expect(mockCallable).toHaveBeenCalledWith({ departmentId: 'dept1' });
    });

    it('should throw error when departmentId is not provided', async () => {
      await expect(adminResetLeaderboard('')).rejects.toThrow(
        'departmentId is required'
      );
    });

    it('should handle errors when resetting leaderboard', async () => {
      const mockCallable = vi.fn().mockRejectedValue(new Error('Not found'));

      vi.mocked(httpsCallable).mockReturnValue(mockCallable as any);

      await expect(adminResetLeaderboard('dept1')).rejects.toThrow(
        'Failed to reset leaderboard: Not found'
      );
    });
  });

  describe('adminGetLeaderboardStatus', () => {
    it('should get leaderboard system status', async () => {
      const mockCallable = vi.fn().mockResolvedValue({
        data: {
          success: true,
          status: {
            totalDepartments: 3,
            totalStudents: 33,
            totalExamAttempts: 150,
            cache: {
              total: 3,
              valid: 2,
              expired: 1,
              totalCachedStudents: 25
            },
            cacheDetails: [
              {
                departmentId: 'dept1',
                totalStudents: 10,
                lastUpdated: { seconds: 1234567890 },
                expiresAt: { seconds: 1234567900 },
                isExpired: false
              },
              {
                departmentId: 'dept2',
                totalStudents: 15,
                lastUpdated: { seconds: 1234567890 },
                expiresAt: { seconds: 1234567900 },
                isExpired: false
              },
              {
                departmentId: 'dept3',
                totalStudents: 8,
                lastUpdated: { seconds: 1234567800 },
                expiresAt: { seconds: 1234567850 },
                isExpired: true
              }
            ]
          },
          timestamp: { seconds: 1234567890 }
        }
      });

      vi.mocked(httpsCallable).mockReturnValue(mockCallable as any);

      const result = await adminGetLeaderboardStatus();

      expect(result.success).toBe(true);
      expect(result.status.totalDepartments).toBe(3);
      expect(result.status.totalStudents).toBe(33);
      expect(result.status.totalExamAttempts).toBe(150);
      expect(result.status.cache.total).toBe(3);
      expect(result.status.cache.valid).toBe(2);
      expect(result.status.cache.expired).toBe(1);
      expect(result.status.cacheDetails).toHaveLength(3);
      expect(mockCallable).toHaveBeenCalledWith({});
    });

    it('should handle empty system status', async () => {
      const mockCallable = vi.fn().mockResolvedValue({
        data: {
          success: true,
          status: {
            totalDepartments: 0,
            totalStudents: 0,
            totalExamAttempts: 0,
            cache: {
              total: 0,
              valid: 0,
              expired: 0,
              totalCachedStudents: 0
            },
            cacheDetails: []
          },
          timestamp: { seconds: 1234567890 }
        }
      });

      vi.mocked(httpsCallable).mockReturnValue(mockCallable as any);

      const result = await adminGetLeaderboardStatus();

      expect(result.success).toBe(true);
      expect(result.status.totalDepartments).toBe(0);
      expect(result.status.cacheDetails).toHaveLength(0);
    });

    it('should handle errors when getting status', async () => {
      const mockCallable = vi.fn().mockRejectedValue(new Error('Unauthorized'));

      vi.mocked(httpsCallable).mockReturnValue(mockCallable as any);

      await expect(adminGetLeaderboardStatus()).rejects.toThrow(
        'Failed to get leaderboard status: Unauthorized'
      );
    });
  });
});
