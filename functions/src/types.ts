import { Timestamp } from 'firebase-admin/firestore';

export interface LeaderboardEntry {
  studentId: string;
  studentName: string;
  departmentId: string;
  totalPoints: number;
  averageScore: number;
  examCount: number;
  rankPosition: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalStudents: number;
  lastUpdated: Timestamp;
  departmentId: string;
  hasMore?: boolean; // Indicates if there are more entries to load
  nextCursor?: number; // Next page cursor (rank position)
}

export interface ExamAttemptData {
  attemptId: string;
  examId: string;
  studentId: string;
  isSubmitted: boolean;
  totalScore: number | null;
  maxScore: number | null;
}

export interface UserProfileData {
  userId: string;
  fullName: string;
  departmentId?: string;
  role?: string;
}

export interface StudentStats {
  studentId: string;
  studentName: string;
  totalPoints: number;
  averageScore: number;
  examCount: number;
}

export interface LeaderboardCache {
  departmentId: string;
  entries: LeaderboardEntry[];
  lastUpdated: Timestamp;
  expiresAt: Timestamp;
  totalStudents: number;
}

export interface PaginationParams {
  limit?: number; // Number of entries per page (default: 50)
  offset?: number; // Starting position (default: 0)
}

export interface DepartmentRanking {
  departmentId: string;
  departmentName: string;
  totalDepartmentScore: number;
  averageScore: number;
  activeStudentCount: number;
  rankPosition: number;
}

export interface DepartmentLeaderboardResponse {
  rankings: DepartmentRanking[];
  totalDepartments: number;
  lastUpdated: Timestamp;
}

export interface DepartmentData {
  id: string;
  name: string;
  createdAt: Timestamp;
}

export interface DepartmentStats {
  departmentId: string;
  departmentName: string;
  totalDepartmentScore: number;
  totalStudentAverages: number;
  activeStudentCount: number;
}

export interface SecurityLogEntry {
  timestamp: Timestamp;
  userId: string;
  action: string;
  reason: string;
  requestedDepartmentId?: string;
  userDepartmentId?: string;
  ipAddress?: string;
}
