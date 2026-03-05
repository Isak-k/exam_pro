/**
 * Unit tests for leaderboard formatter functions
 * Requirements: 8.2, 8.3
 */

import {
  formatLeaderboardEntry,
  formatLeaderboardData,
  formatDepartmentRanking,
  formatDepartmentLeaderboardData,
  parseFormattedLeaderboardEntry,
  parseFormattedLeaderboardData,
  parseFormattedDepartmentRanking,
  parseFormattedDepartmentLeaderboardData,
  formatRankPosition,
  formatScore,
  formatPercentage,
  formatStudentStats,
  createLeaderboardSummary
} from './leaderboard-formatter';
import { LeaderboardEntry, DepartmentRanking, StudentStats } from './types';

describe('Leaderboard Formatter', () => {
  describe('formatRankPosition', () => {
    it('should format rank without suffix by default', () => {
      expect(formatRankPosition(1)).toBe('1');
      expect(formatRankPosition(5)).toBe('5');
      expect(formatRankPosition(100)).toBe('100');
    });

    it('should format rank with ordinal suffix when requested', () => {
      expect(formatRankPosition(1, true)).toBe('1st');
      expect(formatRankPosition(2, true)).toBe('2nd');
      expect(formatRankPosition(3, true)).toBe('3rd');
      expect(formatRankPosition(4, true)).toBe('4th');
      expect(formatRankPosition(11, true)).toBe('11th');
      expect(formatRankPosition(12, true)).toBe('12th');
      expect(formatRankPosition(13, true)).toBe('13th');
      expect(formatRankPosition(21, true)).toBe('21st');
      expect(formatRankPosition(22, true)).toBe('22nd');
      expect(formatRankPosition(23, true)).toBe('23rd');
      expect(formatRankPosition(101, true)).toBe('101st');
    });
  });

  describe('formatScore', () => {
    it('should format score with 2 decimal places by default', () => {
      expect(formatScore(85.5)).toBe('85.50');
      expect(formatScore(100)).toBe('100.00');
      expect(formatScore(75.123)).toBe('75.12');
    });

    it('should format score with custom decimal places', () => {
      expect(formatScore(85.5, 0)).toBe('86');
      expect(formatScore(85.5, 1)).toBe('85.5');
      expect(formatScore(85.5678, 3)).toBe('85.568');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage with 1 decimal place by default', () => {
      expect(formatPercentage(85.5)).toBe('85.5%');
      expect(formatPercentage(100)).toBe('100.0%');
      expect(formatPercentage(75.123)).toBe('75.1%');
    });

    it('should format percentage with custom decimal places', () => {
      expect(formatPercentage(85.5, 0)).toBe('86%');
      expect(formatPercentage(85.5678, 2)).toBe('85.57%');
    });
  });

  describe('formatLeaderboardEntry', () => {
    const sampleEntry: LeaderboardEntry = {
      studentId: 'student1',
      studentName: 'John Doe',
      departmentId: 'dept1',
      totalPoints: 450.5,
      averageScore: 85.75,
      examCount: 5,
      rankPosition: 1
    };

    it('should format leaderboard entry with default options', () => {
      const formatted = formatLeaderboardEntry(sampleEntry);

      expect(formatted.studentId).toBe('student1');
      expect(formatted.studentName).toBe('John Doe');
      expect(formatted.departmentId).toBe('dept1');
      expect(formatted.totalPoints).toBe('450.50');
      expect(formatted.averageScore).toBe('85.75');
      expect(formatted.examCount).toBe(5);
      expect(formatted.rankPosition).toBe(1);
      expect(formatted.rankDisplay).toBe('1');
      expect(formatted.percentageScore).toBeUndefined();
    });

    it('should format with rank suffix when requested', () => {
      const formatted = formatLeaderboardEntry(sampleEntry, { includeRankSuffix: true });
      expect(formatted.rankDisplay).toBe('1st');
    });

    it('should format with percentage when requested', () => {
      const formatted = formatLeaderboardEntry(sampleEntry, { percentageFormat: true });
      expect(formatted.percentageScore).toBe('85.8%');
    });

    it('should format with custom decimal places', () => {
      const formatted = formatLeaderboardEntry(sampleEntry, { decimalPlaces: 1 });
      expect(formatted.totalPoints).toBe('450.5');
      expect(formatted.averageScore).toBe('85.8');
    });

    it('should format with all options combined', () => {
      const formatted = formatLeaderboardEntry(sampleEntry, {
        decimalPlaces: 0,
        percentageFormat: true,
        includeRankSuffix: true
      });

      expect(formatted.totalPoints).toBe('451');
      expect(formatted.averageScore).toBe('86');
      expect(formatted.rankDisplay).toBe('1st');
      expect(formatted.percentageScore).toBe('85.8%');
    });
  });

  describe('formatLeaderboardData', () => {
    const sampleEntries: LeaderboardEntry[] = [
      {
        studentId: 'student1',
        studentName: 'John Doe',
        departmentId: 'dept1',
        totalPoints: 450.5,
        averageScore: 85.75,
        examCount: 5,
        rankPosition: 1
      },
      {
        studentId: 'student2',
        studentName: 'Jane Smith',
        departmentId: 'dept1',
        totalPoints: 420.3,
        averageScore: 82.5,
        examCount: 5,
        rankPosition: 2
      }
    ];

    it('should format multiple entries', () => {
      const formatted = formatLeaderboardData(sampleEntries);

      expect(formatted).toHaveLength(2);
      expect(formatted[0].studentName).toBe('John Doe');
      expect(formatted[0].totalPoints).toBe('450.50');
      expect(formatted[1].studentName).toBe('Jane Smith');
      expect(formatted[1].totalPoints).toBe('420.30');
    });

    it('should apply options to all entries', () => {
      const formatted = formatLeaderboardData(sampleEntries, {
        includeRankSuffix: true,
        percentageFormat: true
      });

      expect(formatted[0].rankDisplay).toBe('1st');
      expect(formatted[0].percentageScore).toBe('85.8%');
      expect(formatted[1].rankDisplay).toBe('2nd');
      expect(formatted[1].percentageScore).toBe('82.5%');
    });

    it('should handle empty array', () => {
      const formatted = formatLeaderboardData([]);
      expect(formatted).toEqual([]);
    });
  });

  describe('formatDepartmentRanking', () => {
    const sampleRanking: DepartmentRanking = {
      departmentId: 'dept1',
      departmentName: 'Computer Science',
      totalDepartmentScore: 5000.5,
      averageScore: 85.5,
      activeStudentCount: 50,
      rankPosition: 1
    };

    it('should format department ranking with default options', () => {
      const formatted = formatDepartmentRanking(sampleRanking);

      expect(formatted.departmentId).toBe('dept1');
      expect(formatted.departmentName).toBe('Computer Science');
      expect(formatted.totalDepartmentScore).toBe('5000.50');
      expect(formatted.averageScore).toBe('85.50');
      expect(formatted.activeStudentCount).toBe(50);
      expect(formatted.rankPosition).toBe(1);
      expect(formatted.rankDisplay).toBe('1');
    });

    it('should format with rank suffix and percentage', () => {
      const formatted = formatDepartmentRanking(sampleRanking, {
        includeRankSuffix: true,
        percentageFormat: true
      });

      expect(formatted.rankDisplay).toBe('1st');
      expect(formatted.percentageScore).toBe('85.5%');
    });
  });

  describe('formatDepartmentLeaderboardData', () => {
    const sampleRankings: DepartmentRanking[] = [
      {
        departmentId: 'dept1',
        departmentName: 'Computer Science',
        totalDepartmentScore: 5000.5,
        averageScore: 85.5,
        activeStudentCount: 50,
        rankPosition: 1
      },
      {
        departmentId: 'dept2',
        departmentName: 'Mathematics',
        totalDepartmentScore: 4800.3,
        averageScore: 83.2,
        activeStudentCount: 45,
        rankPosition: 2
      }
    ];

    it('should format multiple department rankings', () => {
      const formatted = formatDepartmentLeaderboardData(sampleRankings);

      expect(formatted).toHaveLength(2);
      expect(formatted[0].departmentName).toBe('Computer Science');
      expect(formatted[1].departmentName).toBe('Mathematics');
    });
  });

  describe('parseFormattedLeaderboardEntry', () => {
    it('should parse formatted entry back to original structure', () => {
      const original: LeaderboardEntry = {
        studentId: 'student1',
        studentName: 'John Doe',
        departmentId: 'dept1',
        totalPoints: 450.5,
        averageScore: 85.75,
        examCount: 5,
        rankPosition: 1
      };

      const formatted = formatLeaderboardEntry(original);
      const parsed = parseFormattedLeaderboardEntry(formatted);

      expect(parsed.studentId).toBe(original.studentId);
      expect(parsed.studentName).toBe(original.studentName);
      expect(parsed.departmentId).toBe(original.departmentId);
      expect(parsed.totalPoints).toBe(original.totalPoints);
      expect(parsed.averageScore).toBe(original.averageScore);
      expect(parsed.examCount).toBe(original.examCount);
      expect(parsed.rankPosition).toBe(original.rankPosition);
    });
  });

  describe('parseFormattedLeaderboardData', () => {
    it('should parse multiple formatted entries back to original structure', () => {
      const original: LeaderboardEntry[] = [
        {
          studentId: 'student1',
          studentName: 'John Doe',
          departmentId: 'dept1',
          totalPoints: 450.5,
          averageScore: 85.75,
          examCount: 5,
          rankPosition: 1
        },
        {
          studentId: 'student2',
          studentName: 'Jane Smith',
          departmentId: 'dept1',
          totalPoints: 420.3,
          averageScore: 82.5,
          examCount: 5,
          rankPosition: 2
        }
      ];

      const formatted = formatLeaderboardData(original);
      const parsed = parseFormattedLeaderboardData(formatted);

      expect(parsed).toHaveLength(2);
      expect(parsed[0].totalPoints).toBe(original[0].totalPoints);
      expect(parsed[1].totalPoints).toBe(original[1].totalPoints);
    });
  });

  describe('parseFormattedDepartmentRanking', () => {
    it('should parse formatted department ranking back to original structure', () => {
      const original: DepartmentRanking = {
        departmentId: 'dept1',
        departmentName: 'Computer Science',
        totalDepartmentScore: 5000.5,
        averageScore: 85.5,
        activeStudentCount: 50,
        rankPosition: 1
      };

      const formatted = formatDepartmentRanking(original);
      const parsed = parseFormattedDepartmentRanking(formatted);

      expect(parsed.departmentId).toBe(original.departmentId);
      expect(parsed.departmentName).toBe(original.departmentName);
      expect(parsed.totalDepartmentScore).toBe(original.totalDepartmentScore);
      expect(parsed.averageScore).toBe(original.averageScore);
      expect(parsed.activeStudentCount).toBe(original.activeStudentCount);
      expect(parsed.rankPosition).toBe(original.rankPosition);
    });
  });

  describe('parseFormattedDepartmentLeaderboardData', () => {
    it('should parse multiple formatted department rankings back to original structure', () => {
      const original: DepartmentRanking[] = [
        {
          departmentId: 'dept1',
          departmentName: 'Computer Science',
          totalDepartmentScore: 5000.5,
          averageScore: 85.5,
          activeStudentCount: 50,
          rankPosition: 1
        },
        {
          departmentId: 'dept2',
          departmentName: 'Mathematics',
          totalDepartmentScore: 4800.3,
          averageScore: 83.2,
          activeStudentCount: 45,
          rankPosition: 2
        }
      ];

      const formatted = formatDepartmentLeaderboardData(original);
      const parsed = parseFormattedDepartmentLeaderboardData(formatted);

      expect(parsed).toHaveLength(2);
      expect(parsed[0].totalDepartmentScore).toBe(original[0].totalDepartmentScore);
      expect(parsed[1].totalDepartmentScore).toBe(original[1].totalDepartmentScore);
    });
  });

  describe('Round-trip consistency', () => {
    it('should maintain data integrity through format and parse cycle', () => {
      const original: LeaderboardEntry = {
        studentId: 'student1',
        studentName: 'John Doe',
        departmentId: 'dept1',
        totalPoints: 450.5,
        averageScore: 85.75,
        examCount: 5,
        rankPosition: 1
      };

      const formatted = formatLeaderboardEntry(original);
      const parsed = parseFormattedLeaderboardEntry(formatted);

      expect(parsed).toEqual(original);
    });

    it('should maintain data integrity for arrays through format and parse cycle', () => {
      const original: LeaderboardEntry[] = [
        {
          studentId: 'student1',
          studentName: 'John Doe',
          departmentId: 'dept1',
          totalPoints: 450.5,
          averageScore: 85.75,
          examCount: 5,
          rankPosition: 1
        },
        {
          studentId: 'student2',
          studentName: 'Jane Smith',
          departmentId: 'dept1',
          totalPoints: 420.3,
          averageScore: 82.5,
          examCount: 5,
          rankPosition: 2
        }
      ];

      const formatted = formatLeaderboardData(original);
      const parsed = parseFormattedLeaderboardData(formatted);

      expect(parsed).toEqual(original);
    });

    it('should maintain department ranking data integrity through format and parse cycle', () => {
      const original: DepartmentRanking = {
        departmentId: 'dept1',
        departmentName: 'Computer Science',
        totalDepartmentScore: 5000.5,
        averageScore: 85.5,
        activeStudentCount: 50,
        rankPosition: 1
      };

      const formatted = formatDepartmentRanking(original);
      const parsed = parseFormattedDepartmentRanking(formatted);

      expect(parsed).toEqual(original);
    });
  });

  describe('formatStudentStats', () => {
    const sampleStats: StudentStats = {
      studentId: 'student1',
      studentName: 'John Doe',
      totalPoints: 450.5,
      averageScore: 85.75,
      examCount: 5
    };

    it('should format student stats with default options', () => {
      const formatted = formatStudentStats(sampleStats);

      expect(formatted.studentId).toBe('student1');
      expect(formatted.studentName).toBe('John Doe');
      expect(formatted.totalPoints).toBe('450.50');
      expect(formatted.averageScore).toBe('85.75');
      expect(formatted.examCount).toBe(5);
      expect(formatted.percentageScore).toBeUndefined();
    });

    it('should format with percentage when requested', () => {
      const formatted = formatStudentStats(sampleStats, { percentageFormat: true });
      expect(formatted.percentageScore).toBe('85.8%');
    });
  });

  describe('createLeaderboardSummary', () => {
    const sampleEntries: LeaderboardEntry[] = [
      {
        studentId: 'student1',
        studentName: 'John Doe',
        departmentId: 'dept1',
        totalPoints: 450,
        averageScore: 90,
        examCount: 5,
        rankPosition: 1
      },
      {
        studentId: 'student2',
        studentName: 'Jane Smith',
        departmentId: 'dept1',
        totalPoints: 400,
        averageScore: 80,
        examCount: 5,
        rankPosition: 2
      },
      {
        studentId: 'student3',
        studentName: 'Bob Johnson',
        departmentId: 'dept1',
        totalPoints: 350,
        averageScore: 70,
        examCount: 5,
        rankPosition: 3
      }
    ];

    it('should create summary statistics', () => {
      const summary = createLeaderboardSummary(sampleEntries);

      expect(summary.totalStudents).toBe(3);
      expect(summary.averagePoints).toBe('400.00');
      expect(summary.averageScore).toBe('80.00');
      expect(summary.topScore).toBe('90.00');
      expect(summary.totalExams).toBe(15);
    });

    it('should handle empty leaderboard', () => {
      const summary = createLeaderboardSummary([]);

      expect(summary.totalStudents).toBe(0);
      expect(summary.averagePoints).toBe('0.00');
      expect(summary.averageScore).toBe('0.00');
      expect(summary.topScore).toBe('0.00');
      expect(summary.totalExams).toBe(0);
    });

    it('should handle single entry', () => {
      const summary = createLeaderboardSummary([sampleEntries[0]]);

      expect(summary.totalStudents).toBe(1);
      expect(summary.averagePoints).toBe('450.00');
      expect(summary.averageScore).toBe('90.00');
      expect(summary.topScore).toBe('90.00');
      expect(summary.totalExams).toBe(5);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero values', () => {
      const entry: LeaderboardEntry = {
        studentId: 'student1',
        studentName: 'John Doe',
        departmentId: 'dept1',
        totalPoints: 0,
        averageScore: 0,
        examCount: 0,
        rankPosition: 1
      };

      const formatted = formatLeaderboardEntry(entry);
      expect(formatted.totalPoints).toBe('0.00');
      expect(formatted.averageScore).toBe('0.00');
    });

    it('should handle very large numbers', () => {
      const entry: LeaderboardEntry = {
        studentId: 'student1',
        studentName: 'John Doe',
        departmentId: 'dept1',
        totalPoints: 999999.99,
        averageScore: 100,
        examCount: 10000,
        rankPosition: 1
      };

      const formatted = formatLeaderboardEntry(entry);
      expect(formatted.totalPoints).toBe('999999.99');
      expect(formatted.averageScore).toBe('100.00');
    });

    it('should handle decimal precision correctly', () => {
      const entry: LeaderboardEntry = {
        studentId: 'student1',
        studentName: 'John Doe',
        departmentId: 'dept1',
        totalPoints: 123.456789,
        averageScore: 87.654321,
        examCount: 5,
        rankPosition: 1
      };

      const formatted = formatLeaderboardEntry(entry, { decimalPlaces: 3 });
      expect(formatted.totalPoints).toBe('123.457');
      expect(formatted.averageScore).toBe('87.654');
    });
  });
});
