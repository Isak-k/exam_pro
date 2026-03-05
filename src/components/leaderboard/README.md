# Leaderboard Components

Modern, responsive leaderboard components with special styling for top performers.

## Components

### LeaderboardCard

A complete leaderboard display component with header and multiple student entries.

### StudentRankingItem

A reusable component for displaying individual student ranking information.

## LeaderboardCard Component

A modern, responsive leaderboard component with special styling for top performers.

### Features

- **Modern Card Design**: Uses shadcn/ui Card components with gradient header
- **Top 3 Highlighting**: 
  - 🥇 1st Place: Gold styling with Crown icon (#FFD700)
  - 🥈 2nd Place: Silver styling with Trophy icon (#C0C0C0)
  - 🥉 3rd Place: Bronze styling with Medal icon (#CD7F32)
- **Responsive Layout**: Works on mobile and desktop
- **Loading State**: Skeleton loaders while data is fetching
- **Empty State**: Friendly message when no rankings exist
- **Current User Highlight**: Cyan ring around current user's entry
- **Internationalization**: Full i18n support via react-i18next

### Usage

```tsx
import { LeaderboardCard } from "@/components/leaderboard";
import { LeaderboardEntry } from "@/integrations/firebase/types";

function MyComponent() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserId = "user-123";

  return (
    <LeaderboardCard
      entries={entries}
      isLoading={isLoading}
      currentUserId={currentUserId}
      className="max-w-2xl"
    />
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `entries` | `LeaderboardEntry[]` | Yes | Array of leaderboard entries to display |
| `isLoading` | `boolean` | No | Shows skeleton loading state |
| `currentUserId` | `string` | No | Highlights the current user's entry |
| `className` | `string` | No | Additional CSS classes |

## StudentRankingItem Component

A reusable component for displaying individual student ranking information with progress tracking.

### Features

- **Rank Display**: Shows rank position with special icons for top 3
- **Student Information**: Name, points, average score, exam count
- **Progress Bar**: Visual indicator of progress to next rank
- **Current User Highlight**: Cyan ring for current user
- **Performance Indicators**: Exam count and average score display
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Full dark mode compatibility

### Usage

```tsx
import { StudentRankingItem } from "@/components/leaderboard";
import { LeaderboardEntry } from "@/integrations/firebase/types";

function MyComponent() {
  const entry: LeaderboardEntry = {
    studentId: "student-1",
    studentName: "John Doe",
    departmentId: "dept-1",
    totalPoints: 850,
    averageScore: 85.5,
    examCount: 10,
    rankPosition: 4,
  };

  return (
    <StudentRankingItem
      entry={entry}
      isCurrentUser={true}
      nextRankPoints={950} // Points of student in next higher rank
    />
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `entry` | `LeaderboardEntry` | Yes | Student's leaderboard data |
| `isCurrentUser` | `boolean` | No | Highlights as current user |
| `nextRankPoints` | `number` | No | Points needed for next rank (enables progress bar) |
| `className` | `string` | No | Additional CSS classes |

### Progress Bar Behavior

- **With nextRankPoints**: Shows progress bar with points needed
- **Without nextRankPoints**: No progress bar displayed
- **At Top Rank**: Shows "You're at the top!" message
- **Points Exceed Next Rank**: No progress bar (handled automatically)

### Integration Example

```tsx
// Display list of students with progress bars
const entries = [...]; // LeaderboardEntry[]
const currentUserId = 'user-123';

return (
  <div className="space-y-3">
    {entries.map((entry, index) => {
      const nextRank = entries[index - 1]; // Student above in ranking
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
);
```

## Shared Types

### LeaderboardEntry Type

```typescript
interface LeaderboardEntry {
  studentId: string;
  studentName: string;
  departmentId: string;
  totalPoints: number;
  averageScore: number;
  examCount: number;
  rankPosition: number;
}
```

## Styling

Both components use consistent styling:
- **Gold (1st)**: `#FFD700` - Yellow/Amber gradient
- **Silver (2nd)**: `#C0C0C0` - Gray/Slate gradient
- **Bronze (3rd)**: `#CD7F32` - Orange/Amber gradient
- **Icons**: Crown, Trophy, Medal from lucide-react
- **Current User**: Cyan ring highlight
- **Progress Bar**: Rank-specific colors

## Internationalization Keys

Add these keys to your translation files:

```json
{
  "leaderboard": {
    "title": "Leaderboard",
    "you": "You",
    "exams": "exams",
    "avgScore": "Avg",
    "pts": "pts",
    "nextRank": "Next rank",
    "ptsNeeded": "pts needed",
    "topRank": "You're at the top!",
    "empty": {
      "title": "No Rankings Yet",
      "description": "Complete exams to appear on the leaderboard"
    }
  }
}
```

## Testing

Run tests with:
```bash
# Test LeaderboardCard
npm test -- LeaderboardCard.test.tsx

# Test StudentRankingItem
npm test -- StudentRankingItem.test.tsx

# Test all leaderboard components
npm test -- src/components/leaderboard
```

## Requirements Satisfied

### LeaderboardCard
- ✅ 4.1: Modern card-style design with responsive layout
- ✅ 4.2: Top 3 highlighting with Gold, Silver, Bronze colors
- ✅ 4.3: Trophy, medal, and crown icons for top performers

### StudentRankingItem
- ✅ 1.3: Display rank position, student name, total points, average score, and exam count
- ✅ 4.4: Progress bar showing proximity to next rank

