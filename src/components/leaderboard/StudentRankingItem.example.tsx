import { StudentRankingItem } from './StudentRankingItem';
import { LeaderboardEntry } from '@/integrations/firebase/types';

/**
 * Example usage of StudentRankingItem component
 * 
 * This component displays a single student's ranking information with:
 * - Rank position with icons for top 3 (Crown, Trophy, Medal)
 * - Student name and "You" badge for current user
 * - Total points and average score
 * - Exam count
 * - Progress bar showing proximity to next rank
 * - Special styling for top 3 students
 * - Highlight ring for current user
 */

// Example data
const mockEntries: LeaderboardEntry[] = [
  {
    studentId: 'student-1',
    studentName: 'Alice Johnson',
    departmentId: 'dept-cs',
    totalPoints: 1250,
    averageScore: 92.5,
    examCount: 15,
    rankPosition: 1,
  },
  {
    studentId: 'student-2',
    studentName: 'Bob Smith',
    departmentId: 'dept-cs',
    totalPoints: 1100,
    averageScore: 88.0,
    examCount: 12,
    rankPosition: 2,
  },
  {
    studentId: 'student-3',
    studentName: 'Charlie Brown',
    departmentId: 'dept-cs',
    totalPoints: 950,
    averageScore: 85.5,
    examCount: 10,
    rankPosition: 3,
  },
  {
    studentId: 'student-4',
    studentName: 'Diana Prince',
    departmentId: 'dept-cs',
    totalPoints: 850,
    averageScore: 82.0,
    examCount: 9,
    rankPosition: 4,
  },
];

export function StudentRankingItemExample() {
  const currentUserId = 'student-4';

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">StudentRankingItem Examples</h2>
        <p className="text-muted-foreground mb-6">
          Reusable component for displaying individual student rankings
        </p>
      </div>

      {/* Example 1: First Place (with top rank message) */}
      <div>
        <h3 className="text-lg font-semibold mb-2">First Place (Top Rank)</h3>
        <StudentRankingItem 
          entry={mockEntries[0]} 
          nextRankPoints={1250} // Already at top
        />
      </div>

      {/* Example 2: Second Place */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Second Place</h3>
        <StudentRankingItem 
          entry={mockEntries[1]} 
          nextRankPoints={1250} // 150 points to first place
        />
      </div>

      {/* Example 3: Third Place */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Third Place</h3>
        <StudentRankingItem 
          entry={mockEntries[2]} 
          nextRankPoints={1100} // 150 points to second place
        />
      </div>

      {/* Example 4: Current User (highlighted) */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Current User (4th Place)</h3>
        <StudentRankingItem 
          entry={mockEntries[3]} 
          isCurrentUser={true}
          nextRankPoints={950} // 100 points to third place
        />
      </div>

      {/* Example 5: Without Progress Bar */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Without Progress Bar</h3>
        <StudentRankingItem 
          entry={mockEntries[3]} 
          // No nextRankPoints provided
        />
      </div>

      {/* Example 6: Standalone Usage */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Standalone with Custom Styling</h3>
        <StudentRankingItem 
          entry={mockEntries[1]} 
          nextRankPoints={1250}
          className="border-4"
        />
      </div>

      {/* Usage Notes */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Usage Notes</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>Use <code>isCurrentUser</code> to highlight the current user with a cyan ring</li>
          <li>Provide <code>nextRankPoints</code> to show progress bar to next rank</li>
          <li>Top 3 students get special icons (Crown, Trophy, Medal) and styling</li>
          <li>Progress bar automatically calculates percentage and points needed</li>
          <li>Component is fully responsive and supports dark mode</li>
          <li>Can be used standalone or within LeaderboardCard</li>
        </ul>
      </div>

      {/* Integration Example */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Integration Example</h3>
        <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
{`import { StudentRankingItem } from '@/components/leaderboard';

// In your component
const entries = [...]; // LeaderboardEntry[]
const currentUserId = 'user-123';

return (
  <div className="space-y-3">
    {entries.map((entry, index) => {
      const nextRank = entries[index - 1];
      return (
        <StudentRankingItem
          key={entry.studentId}
          entry={entry}
          isCurrentUser={entry.studentId === currentUserId}
          nextRankPoints={nextRank?.totalPoints}
        />
      );
    })}
  </div>
);`}
        </pre>
      </div>
    </div>
  );
}
