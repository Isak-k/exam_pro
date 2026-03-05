/**
 * Leaderboard Data Formatter Functions
 * 
 * Requirements: 8.2, 8.3
 * 
 * This module provides utility functions for formatting leaderboard data
 * for UI display with consistent data transformation.
 */

import { LeaderboardEntry, DepartmentRanking, StudentStats } from './types';

/**
 * Formatting options for leaderboard data
 */
export interface FormatterOptions {
  decimalPlaces?: number; // Number of decimal places for scores (default: 2)
  percentageFormat?: boolean; // Format scores as percentages (default: false)
  includeRankSuffix?: boolean; // Add ordinal suffix to rank (1st, 2nd, 3rd) (default: false)
}

/**
 * Formatted leaderboard entry for UI display
 * Requirements: 8.2
 */
export interface FormattedLeaderboardEntry {
  studentId: string;
  studentName: string;
  departmentId: string;
  totalPoints: string; // Formatted as string with proper decimals
  averageScore: string; // Formatted as string with proper decimals
  examCount: number;
  rankPosition: number;
  rankDisplay: string; // Formatted rank with optional suffix (e.g., "1st", "2nd")
  percentageScore?: string; // Optional percentage representation
}

/**
 * Formatted department ranking for UI display
 */
export interface FormattedDepartmentRanking {
  departmentId: string;
  departmentName: string;
  totalDepartmentScore: string;
  averageScore: string;
  activeStudentCount: number;
  rankPosition: number;
  rankDisplay: string;
  percentageScore?: string;
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 * 
 * @param num - The number to get suffix for
 * @returns The ordinal suffix (st, nd, rd, th)
 */
function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
}

/**
 * Format a rank position with optional ordinal suffix
 * 
 * @param position - The rank position
 * @param includeSuffix - Whether to include ordinal suffix
 * @returns Formatted rank string
 */
export function formatRankPosition(position: number, includeSuffix: boolean = false): string {
  if (includeSuffix) {
    return `${position}${getOrdinalSuffix(position)}`;
  }
  return position.toString();
}

/**
 * Format a score value with specified decimal places
 * 
 * @param score - The score to format
 * @param decimalPlaces - Number of decimal places (default: 2)
 * @returns Formatted score string
 */
export function formatScore(score: number, decimalPlaces: number = 2): string {
  return score.toFixed(decimalPlaces);
}

/**
 * Format a score as a percentage
 * 
 * @param score - The score to format (assumed to be 0-100 range)
 * @param decimalPlaces - Number of decimal places (default: 1)
 * @returns Formatted percentage string with % symbol
 */
export function formatPercentage(score: number, decimalPlaces: number = 1): string {
  return `${score.toFixed(decimalPlaces)}%`;
}

/**
 * Format a leaderboard entry for UI display
 * Requirements: 8.2
 * 
 * This function transforms raw leaderboard data into a formatted structure
 * suitable for display in UI components.
 * 
 * @param entry - The leaderboard entry to format
 * @param options - Formatting options
 * @returns Formatted leaderboard entry
 */
export function formatLeaderboardEntry(
  entry: LeaderboardEntry,
  options: FormatterOptions = {}
): FormattedLeaderboardEntry {
  const {
    decimalPlaces = 2,
    percentageFormat = false,
    includeRankSuffix = false
  } = options;

  const formatted: FormattedLeaderboardEntry = {
    studentId: entry.studentId,
    studentName: entry.studentName,
    departmentId: entry.departmentId,
    totalPoints: formatScore(entry.totalPoints, decimalPlaces),
    averageScore: formatScore(entry.averageScore, decimalPlaces),
    examCount: entry.examCount,
    rankPosition: entry.rankPosition,
    rankDisplay: formatRankPosition(entry.rankPosition, includeRankSuffix)
  };

  // Add percentage format if requested
  if (percentageFormat) {
    formatted.percentageScore = formatPercentage(entry.averageScore, 1);
  }

  return formatted;
}

/**
 * Format multiple leaderboard entries
 * Requirements: 8.2
 * 
 * @param entries - Array of leaderboard entries to format
 * @param options - Formatting options
 * @returns Array of formatted leaderboard entries
 */
export function formatLeaderboardData(
  entries: LeaderboardEntry[],
  options: FormatterOptions = {}
): FormattedLeaderboardEntry[] {
  return entries.map(entry => formatLeaderboardEntry(entry, options));
}

/**
 * Format a department ranking for UI display
 * 
 * @param ranking - The department ranking to format
 * @param options - Formatting options
 * @returns Formatted department ranking
 */
export function formatDepartmentRanking(
  ranking: DepartmentRanking,
  options: FormatterOptions = {}
): FormattedDepartmentRanking {
  const {
    decimalPlaces = 2,
    percentageFormat = false,
    includeRankSuffix = false
  } = options;

  const formatted: FormattedDepartmentRanking = {
    departmentId: ranking.departmentId,
    departmentName: ranking.departmentName,
    totalDepartmentScore: formatScore(ranking.totalDepartmentScore, decimalPlaces),
    averageScore: formatScore(ranking.averageScore, decimalPlaces),
    activeStudentCount: ranking.activeStudentCount,
    rankPosition: ranking.rankPosition,
    rankDisplay: formatRankPosition(ranking.rankPosition, includeRankSuffix)
  };

  // Add percentage format if requested
  if (percentageFormat) {
    formatted.percentageScore = formatPercentage(ranking.averageScore, 1);
  }

  return formatted;
}

/**
 * Format multiple department rankings
 * 
 * @param rankings - Array of department rankings to format
 * @param options - Formatting options
 * @returns Array of formatted department rankings
 */
export function formatDepartmentLeaderboardData(
  rankings: DepartmentRanking[],
  options: FormatterOptions = {}
): FormattedDepartmentRanking[] {
  return rankings.map(ranking => formatDepartmentRanking(ranking, options));
}

/**
 * Parse formatted leaderboard entry back to raw entry
 * Requirements: 8.3
 * 
 * This function converts formatted display data back into the original
 * leaderboard entry structure for round-trip compatibility.
 * 
 * @param formatted - The formatted leaderboard entry
 * @returns Original leaderboard entry
 */
export function parseFormattedLeaderboardEntry(
  formatted: FormattedLeaderboardEntry
): LeaderboardEntry {
  return {
    studentId: formatted.studentId,
    studentName: formatted.studentName,
    departmentId: formatted.departmentId,
    totalPoints: parseFloat(formatted.totalPoints),
    averageScore: parseFloat(formatted.averageScore),
    examCount: formatted.examCount,
    rankPosition: formatted.rankPosition
  };
}

/**
 * Parse multiple formatted leaderboard entries back to raw entries
 * Requirements: 8.3
 * 
 * @param formattedEntries - Array of formatted leaderboard entries
 * @returns Array of original leaderboard entries
 */
export function parseFormattedLeaderboardData(
  formattedEntries: FormattedLeaderboardEntry[]
): LeaderboardEntry[] {
  return formattedEntries.map(entry => parseFormattedLeaderboardEntry(entry));
}

/**
 * Parse formatted department ranking back to raw ranking
 * Requirements: 8.3
 * 
 * @param formatted - The formatted department ranking
 * @returns Original department ranking
 */
export function parseFormattedDepartmentRanking(
  formatted: FormattedDepartmentRanking
): DepartmentRanking {
  return {
    departmentId: formatted.departmentId,
    departmentName: formatted.departmentName,
    totalDepartmentScore: parseFloat(formatted.totalDepartmentScore),
    averageScore: parseFloat(formatted.averageScore),
    activeStudentCount: formatted.activeStudentCount,
    rankPosition: formatted.rankPosition
  };
}

/**
 * Parse multiple formatted department rankings back to raw rankings
 * Requirements: 8.3
 * 
 * @param formattedRankings - Array of formatted department rankings
 * @returns Array of original department rankings
 */
export function parseFormattedDepartmentLeaderboardData(
  formattedRankings: FormattedDepartmentRanking[]
): DepartmentRanking[] {
  return formattedRankings.map(ranking => parseFormattedDepartmentRanking(ranking));
}

/**
 * Format student statistics for display
 * 
 * @param stats - Student statistics to format
 * @param options - Formatting options
 * @returns Formatted statistics object
 */
export function formatStudentStats(
  stats: StudentStats,
  options: FormatterOptions = {}
): {
  studentId: string;
  studentName: string;
  totalPoints: string;
  averageScore: string;
  examCount: number;
  percentageScore?: string;
} {
  const {
    decimalPlaces = 2,
    percentageFormat = false
  } = options;

  const formatted = {
    studentId: stats.studentId,
    studentName: stats.studentName,
    totalPoints: formatScore(stats.totalPoints, decimalPlaces),
    averageScore: formatScore(stats.averageScore, decimalPlaces),
    examCount: stats.examCount
  };

  if (percentageFormat) {
    return {
      ...formatted,
      percentageScore: formatPercentage(stats.averageScore, 1)
    };
  }

  return formatted;
}

/**
 * Create a summary of leaderboard data for display
 * 
 * @param entries - Array of leaderboard entries
 * @returns Summary statistics
 */
export function createLeaderboardSummary(entries: LeaderboardEntry[]): {
  totalStudents: number;
  averagePoints: string;
  averageScore: string;
  topScore: string;
  totalExams: number;
} {
  if (entries.length === 0) {
    return {
      totalStudents: 0,
      averagePoints: '0.00',
      averageScore: '0.00',
      topScore: '0.00',
      totalExams: 0
    };
  }

  const totalPoints = entries.reduce((sum, entry) => sum + entry.totalPoints, 0);
  const totalScores = entries.reduce((sum, entry) => sum + entry.averageScore, 0);
  const totalExams = entries.reduce((sum, entry) => sum + entry.examCount, 0);
  const topScore = Math.max(...entries.map(entry => entry.averageScore));

  return {
    totalStudents: entries.length,
    averagePoints: formatScore(totalPoints / entries.length, 2),
    averageScore: formatScore(totalScores / entries.length, 2),
    topScore: formatScore(topScore, 2),
    totalExams
  };
}
