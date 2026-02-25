/**
 * Example usage of leaderboard formatter functions
 * Requirements: 8.2, 8.3
 * 
 * This file demonstrates how to use the formatter functions
 * to prepare leaderboard data for UI display.
 */

import {
  formatLeaderboardData,
  formatDepartmentLeaderboardData,
  parseFormattedLeaderboardData,
  formatRankPosition,
  formatScore,
  formatPercentage,
  createLeaderboardSummary
} from './leaderboard-formatter';
import { LeaderboardEntry, DepartmentRanking } from './types';

// Example 1: Format leaderboard entries for basic display
function example1_BasicFormatting() {
  const entries: LeaderboardEntry[] = [
    {
      studentId: 'student1',
      studentName: 'Alice Johnson',
      departmentId: 'cs-dept',
      totalPoints: 485.75,
      averageScore: 87.5,
      examCount: 6,
      rankPosition: 1
    },
    {
      studentId: 'student2',
      studentName: 'Bob Smith',
      departmentId: 'cs-dept',
      totalPoints: 450.25,
      averageScore: 85.2,
      examCount: 5,
      rankPosition: 2
    },
    {
      studentId: 'student3',
      studentName: 'Carol Davis',
      departmentId: 'cs-dept',
      totalPoints: 420.5,
      averageScore: 82.8,
      examCount: 5,
      rankPosition: 3
    }
  ];

  // Format with default options (2 decimal places, no suffix, no percentage)
  const formatted = formatLeaderboardData(entries);

  console.log('Basic Formatting:');
  formatted.forEach(entry => {
    console.log(`${entry.rankDisplay}. ${entry.studentName}`);
    console.log(`   Points: ${entry.totalPoints}, Avg: ${entry.averageScore}`);
  });

  // Output:
  // 1. Alice Johnson
  //    Points: 485.75, Avg: 87.50
  // 2. Bob Smith
  //    Points: 450.25, Avg: 85.20
  // 3. Carol Davis
  //    Points: 420.50, Avg: 82.80
}

// Example 2: Format with ordinal suffixes and percentages
function example2_FormattingWithOptions() {
  const entries: LeaderboardEntry[] = [
    {
      studentId: 'student1',
      studentName: 'Alice Johnson',
      departmentId: 'cs-dept',
      totalPoints: 485.75,
      averageScore: 87.5,
      examCount: 6,
      rankPosition: 1
    },
    {
      studentId: 'student2',
      studentName: 'Bob Smith',
      departmentId: 'cs-dept',
      totalPoints: 450.25,
      averageScore: 85.2,
      examCount: 5,
      rankPosition: 2
    }
  ];

  // Format with ordinal suffixes and percentage display
  const formatted = formatLeaderboardData(entries, {
    includeRankSuffix: true,
    percentageFormat: true,
    decimalPlaces: 1
  });

  console.log('\nFormatting with Options:');
  formatted.forEach(entry => {
    console.log(`${entry.rankDisplay} - ${entry.studentName}`);
    console.log(`   Points: ${entry.totalPoints}, Score: ${entry.percentageScore}`);
  });

  // Output:
  // 1st - Alice Johnson
  //    Points: 485.8, Score: 87.5%
  // 2nd - Bob Smith
  //    Points: 450.2, Score: 85.2%
}

// Example 3: Format department rankings
function example3_DepartmentFormatting() {
  const rankings: DepartmentRanking[] = [
    {
      departmentId: 'cs-dept',
      departmentName: 'Computer Science',
      totalDepartmentScore: 12500.5,
      averageScore: 86.5,
      activeStudentCount: 50,
      rankPosition: 1
    },
    {
      departmentId: 'math-dept',
      departmentName: 'Mathematics',
      totalDepartmentScore: 11800.3,
      averageScore: 84.2,
      activeStudentCount: 45,
      rankPosition: 2
    }
  ];

  const formatted = formatDepartmentLeaderboardData(rankings, {
    includeRankSuffix: true,
    percentageFormat: true
  });

  console.log('\nDepartment Rankings:');
  formatted.forEach(dept => {
    console.log(`${dept.rankDisplay} - ${dept.departmentName}`);
    console.log(`   Students: ${dept.activeStudentCount}, Avg: ${dept.percentageScore}`);
  });

  // Output:
  // 1st - Computer Science
  //    Students: 50, Avg: 86.5%
  // 2nd - Mathematics
  //    Students: 45, Avg: 84.2%
}

// Example 4: Round-trip conversion (format and parse back)
function example4_RoundTripConversion() {
  const original: LeaderboardEntry[] = [
    {
      studentId: 'student1',
      studentName: 'Alice Johnson',
      departmentId: 'cs-dept',
      totalPoints: 485.75,
      averageScore: 87.5,
      examCount: 6,
      rankPosition: 1
    }
  ];

  // Format for display
  const formatted = formatLeaderboardData(original);
  
  // Parse back to original structure
  const parsed = parseFormattedLeaderboardData(formatted);

  console.log('\nRound-trip Conversion:');
  console.log('Original:', original[0]);
  console.log('Formatted:', formatted[0]);
  console.log('Parsed:', parsed[0]);
  console.log('Data integrity maintained:', JSON.stringify(original) === JSON.stringify(parsed));

  // Output:
  // Data integrity maintained: true
}

// Example 5: Create leaderboard summary
function example5_LeaderboardSummary() {
  const entries: LeaderboardEntry[] = [
    {
      studentId: 'student1',
      studentName: 'Alice Johnson',
      departmentId: 'cs-dept',
      totalPoints: 485.75,
      averageScore: 87.5,
      examCount: 6,
      rankPosition: 1
    },
    {
      studentId: 'student2',
      studentName: 'Bob Smith',
      departmentId: 'cs-dept',
      totalPoints: 450.25,
      averageScore: 85.2,
      examCount: 5,
      rankPosition: 2
    },
    {
      studentId: 'student3',
      studentName: 'Carol Davis',
      departmentId: 'cs-dept',
      totalPoints: 420.5,
      averageScore: 82.8,
      examCount: 5,
      rankPosition: 3
    }
  ];

  const summary = createLeaderboardSummary(entries);

  console.log('\nLeaderboard Summary:');
  console.log(`Total Students: ${summary.totalStudents}`);
  console.log(`Average Points: ${summary.averagePoints}`);
  console.log(`Average Score: ${summary.averageScore}%`);
  console.log(`Top Score: ${summary.topScore}%`);
  console.log(`Total Exams: ${summary.totalExams}`);

  // Output:
  // Total Students: 3
  // Average Points: 452.17
  // Average Score: 85.17%
  // Top Score: 87.50%
  // Total Exams: 16
}

// Example 6: Individual formatting functions
function example6_IndividualFormatters() {
  console.log('\nIndividual Formatting Functions:');
  
  // Format rank positions
  console.log('Ranks:', formatRankPosition(1, true), formatRankPosition(2, true), formatRankPosition(3, true));
  // Output: Ranks: 1st 2nd 3rd
  
  // Format scores
  console.log('Score:', formatScore(87.5678, 2));
  // Output: Score: 87.57
  
  // Format percentages
  console.log('Percentage:', formatPercentage(87.5678, 1));
  // Output: Percentage: 87.6%
}

// Example 7: UI Component Integration
function example7_UIComponentIntegration() {
  // This example shows how to use the formatter in a React component
  // or any UI framework
  
  const rawEntries: LeaderboardEntry[] = [
    {
      studentId: 'student1',
      studentName: 'Alice Johnson',
      departmentId: 'cs-dept',
      totalPoints: 485.75,
      averageScore: 87.5,
      examCount: 6,
      rankPosition: 1
    }
  ];

  // Format for display in UI
  const displayData = formatLeaderboardData(rawEntries, {
    decimalPlaces: 1,
    percentageFormat: true,
    includeRankSuffix: true
  });

  // Use in component
  console.log('\nUI Display Data:');
  displayData.forEach(entry => {
    // This data is ready to be rendered in your UI
    const displayText = {
      rank: entry.rankDisplay,           // "1st"
      name: entry.studentName,           // "Alice Johnson"
      points: entry.totalPoints,         // "485.8"
      score: entry.percentageScore,      // "87.5%"
      exams: entry.examCount             // 6
    };
    console.log(displayText);
  });

  // Output:
  // { rank: '1st', name: 'Alice Johnson', points: '485.8', score: '87.5%', exams: 6 }
}

// Example 8: Handling edge cases
function example8_EdgeCases() {
  console.log('\nEdge Cases:');

  // Empty leaderboard
  const emptyEntries: LeaderboardEntry[] = [];
  const emptySummary = createLeaderboardSummary(emptyEntries);
  console.log('Empty leaderboard summary:', emptySummary);

  // Zero values
  const zeroEntry: LeaderboardEntry = {
    studentId: 'student1',
    studentName: 'New Student',
    departmentId: 'cs-dept',
    totalPoints: 0,
    averageScore: 0,
    examCount: 0,
    rankPosition: 1
  };
  const formattedZero = formatLeaderboardData([zeroEntry]);
  console.log('Zero values:', formattedZero[0]);

  // Very large numbers
  const largeEntry: LeaderboardEntry = {
    studentId: 'student2',
    studentName: 'Top Student',
    departmentId: 'cs-dept',
    totalPoints: 999999.99,
    averageScore: 100,
    examCount: 10000,
    rankPosition: 1
  };
  const formattedLarge = formatLeaderboardData([largeEntry]);
  console.log('Large numbers:', formattedLarge[0]);
}

// Run all examples
export function runAllExamples() {
  console.log('=== Leaderboard Formatter Examples ===\n');
  
  example1_BasicFormatting();
  example2_FormattingWithOptions();
  example3_DepartmentFormatting();
  example4_RoundTripConversion();
  example5_LeaderboardSummary();
  example6_IndividualFormatters();
  example7_UIComponentIntegration();
  example8_EdgeCases();
  
  console.log('\n=== Examples Complete ===');
}

// Uncomment to run examples
// runAllExamples();
