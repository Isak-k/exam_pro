# Leaderboard Formatter Functions

**Requirements: 8.2, 8.3**

This document describes the leaderboard formatter functions that prepare ranking data for UI display.

## Overview

The leaderboard formatter provides utility functions for:
- Formatting leaderboard entries for UI display (Requirement 8.2)
- Formatting scores, percentages, and rankings with consistent precision
- Converting formatted data back to original structure (Requirement 8.3)
- Creating summary statistics for leaderboard data
- Supporting round-trip data transformation

## Core Functions

### formatLeaderboardData

Formats an array of leaderboard entries for UI display.

```typescript
function formatLeaderboardData(
  entries: LeaderboardEntry[],
  options?: FormatterOptions
): FormattedLeaderboardEntry[]
```

**Parameters:**
- `entries`: Array of raw leaderboard entries
- `options`: Optional formatting configuration
  - `decimalPlaces`: Number of decimal places for scores (default: 2)
  - `percentageFormat`: Include percentage representation (default: false)
  - `includeRankSuffix`: Add ordinal suffix to rank (1st, 2nd, 3rd) (default: false)

**Returns:** Array of formatted entries with string-based scores ready for display

**Example:**
```typescript
const entries: LeaderboardEntry[] = [
  {
    studentId: 'student1',
    studentName: 'Alice Johnson',
    totalPoints: 485.75,
    averageScore: 87.5,
    examCount: 6,
    rankPosition: 1
  }
];

const formatted = formatLeaderboardData(entries, {
  decimalPlaces: 1,
  percentageFormat: true,
  includeRankSuffix: true
});

// Result:
// {
//   studentName: 'Alice Johnson',
//   totalPoints: '485.8',
//   averageScore: '87.5',
//   rankDisplay: '1st',
//   percentageScore: '87.5%'
// }
```

### parseFormattedLeaderboardData

Converts formatted leaderboard data back to original structure for round-trip compatibility.

```typescript
function parseFormattedLeaderboardData(
  formattedEntries: FormattedLeaderboardEntry[]
): LeaderboardEntry[]
```

**Parameters:**
- `formattedEntries`: Array of formatted leaderboard entries

**Returns:** Array of original leaderboard entries with numeric values

**Example:**
```typescript
const original = [{ totalPoints: 485.75, averageScore: 87.5, ... }];
const formatted = formatLeaderboardData(original);
const parsed = parseFormattedLeaderboardData(formatted);

// parsed === original (data integrity maintained)
```

### formatDepartmentLeaderboardData

Formats department rankings for UI display.

```typescript
function formatDepartmentLeaderboardData(
  rankings: DepartmentRanking[],
  options?: FormatterOptions
): FormattedDepartmentRanking[]
```

**Parameters:**
- `rankings`: Array of department rankings
- `options`: Optional formatting configuration (same as formatLeaderboardData)

**Returns:** Array of formatted department rankings

**Example:**
```typescript
const rankings: DepartmentRanking[] = [
  {
    departmentName: 'Computer Science',
    totalDepartmentScore: 12500.5,
    averageScore: 86.5,
    activeStudentCount: 50,
    rankPosition: 1
  }
];

const formatted = formatDepartmentLeaderboardData(rankings, {
  includeRankSuffix: true,
  percentageFormat: true
});
```

## Utility Functions

### formatRankPosition

Formats a rank position with optional ordinal suffix.

```typescript
function formatRankPosition(position: number, includeSuffix?: boolean): string
```

**Examples:**
```typescript
formatRankPosition(1, true)   // "1st"
formatRankPosition(2, true)   // "2nd"
formatRankPosition(3, true)   // "3rd"
formatRankPosition(11, true)  // "11th"
formatRankPosition(21, true)  // "21st"
```

### formatScore

Formats a score with specified decimal places.

```typescript
function formatScore(score: number, decimalPlaces?: number): string
```

**Examples:**
```typescript
formatScore(85.5)        // "85.50"
formatScore(85.5, 1)     // "85.5"
formatScore(85.5678, 3)  // "85.568"
```

### formatPercentage

Formats a score as a percentage with % symbol.

```typescript
function formatPercentage(score: number, decimalPlaces?: number): string
```

**Examples:**
```typescript
formatPercentage(85.5)       // "85.5%"
formatPercentage(85.5, 0)    // "86%"
formatPercentage(85.5678, 2) // "85.57%"
```

### createLeaderboardSummary

Creates summary statistics for a leaderboard.

```typescript
function createLeaderboardSummary(entries: LeaderboardEntry[]): {
  totalStudents: number;
  averagePoints: string;
  averageScore: string;
  topScore: string;
  totalExams: number;
}
```

**Example:**
```typescript
const summary = createLeaderboardSummary(entries);
// {
//   totalStudents: 50,
//   averagePoints: "425.50",
//   averageScore: "85.25",
//   topScore: "95.00",
//   totalExams: 250
// }
```

## Data Types

### FormattedLeaderboardEntry

```typescript
interface FormattedLeaderboardEntry {
  studentId: string;
  studentName: string;
  departmentId: string;
  totalPoints: string;        // Formatted with decimals
  averageScore: string;       // Formatted with decimals
  examCount: number;
  rankPosition: number;
  rankDisplay: string;        // e.g., "1st", "2nd", or "1", "2"
  percentageScore?: string;   // e.g., "87.5%" (optional)
}
```

### FormatterOptions

```typescript
interface FormatterOptions {
  decimalPlaces?: number;      // Default: 2
  percentageFormat?: boolean;  // Default: false
  includeRankSuffix?: boolean; // Default: false
}
```

## Usage Patterns

### Pattern 1: Basic UI Display

```typescript
// Get raw data from backend
const rawData = await calculateDepartmentLeaderboard({ departmentId });

// Format for display
const displayData = formatLeaderboardData(rawData.entries, {
  decimalPlaces: 1,
  percentageFormat: true
});

// Render in UI
displayData.forEach(entry => {
  console.log(`${entry.studentName}: ${entry.percentageScore}`);
});
```

### Pattern 2: Round-Trip Data Transformation

```typescript
// Original data
const original = getLeaderboardData();

// Format for display
const formatted = formatLeaderboardData(original);

// Send to UI, receive back, parse
const parsed = parseFormattedLeaderboardData(formatted);

// Data integrity maintained
assert(JSON.stringify(original) === JSON.stringify(parsed));
```

### Pattern 3: Custom Formatting for Different Views

```typescript
// Mobile view: compact format
const mobileData = formatLeaderboardData(entries, {
  decimalPlaces: 0,
  includeRankSuffix: false
});

// Desktop view: detailed format
const desktopData = formatLeaderboardData(entries, {
  decimalPlaces: 2,
  percentageFormat: true,
  includeRankSuffix: true
});
```

### Pattern 4: Summary Dashboard

```typescript
const entries = await getLeaderboardEntries();
const summary = createLeaderboardSummary(entries);

// Display summary card
console.log(`
  Total Students: ${summary.totalStudents}
  Average Score: ${summary.averageScore}%
  Top Score: ${summary.topScore}%
  Total Exams: ${summary.totalExams}
`);
```

## Integration with UI Components

### React Component Example

```typescript
import { formatLeaderboardData } from './leaderboard-formatter';

function LeaderboardComponent({ entries }) {
  const displayData = formatLeaderboardData(entries, {
    decimalPlaces: 1,
    percentageFormat: true,
    includeRankSuffix: true
  });

  return (
    <div>
      {displayData.map(entry => (
        <div key={entry.studentId}>
          <span>{entry.rankDisplay}</span>
          <span>{entry.studentName}</span>
          <span>{entry.percentageScore}</span>
        </div>
      ))}
    </div>
  );
}
```

## Testing

The formatter includes comprehensive unit tests covering:
- Basic formatting with default options
- Custom formatting options
- Round-trip data transformation
- Edge cases (zero values, large numbers, empty arrays)
- Data integrity validation

Run tests:
```bash
cd functions
npm test -- leaderboard-formatter.test.ts
```

## Requirements Traceability

- **Requirement 8.2**: Implemented by `formatLeaderboardData`, `formatLeaderboardEntry`, and related formatting functions
- **Requirement 8.3**: Implemented by `parseFormattedLeaderboardData`, `parseFormattedLeaderboardEntry`, and related parsing functions
- **Requirement 8.4**: Validated by round-trip tests ensuring format → parse produces equivalent data

## Files

- `functions/src/leaderboard-formatter.ts` - Main implementation
- `functions/src/leaderboard-formatter.test.ts` - Unit tests
- `functions/src/leaderboard-formatter.example.ts` - Usage examples
- `functions/LEADERBOARD_FORMATTER.md` - This documentation

## Best Practices

1. **Always use formatter for UI display**: Don't format numbers manually in UI components
2. **Consistent decimal places**: Use the same `decimalPlaces` setting across related views
3. **Round-trip validation**: When data needs to be sent back to backend, use parse functions
4. **Performance**: Formatter functions are lightweight and can be called frequently
5. **Type safety**: Use TypeScript types to ensure correct data structures

## Related Documentation

- [Ranking Parser](./RANKING_PARSER_INTEGRATION.md) - Data validation and parsing
- [Leaderboard Functions](./LEADERBOARD_FUNCTION_GUIDE.md) - Backend calculation functions
- [Security Validation](./SECURITY_VALIDATION.md) - Security and access control
