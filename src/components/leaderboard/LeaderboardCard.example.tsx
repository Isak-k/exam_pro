/**
 * Example usage of LeaderboardCard component
 * This file demonstrates how to use the LeaderboardCard with sample data
 */

import { LeaderboardCard } from "./LeaderboardCard";
import { LeaderboardEntry } from "@/integrations/firebase/types";

// Sample data for demonstration
const sampleEntries: LeaderboardEntry[] = [
  {
    studentId: "1",
    studentName: "Alice Johnson",
    departmentId: "CS",
    totalPoints: 950,
    averageScore: 95.0,
    examCount: 10,
    rankPosition: 1,
  },
  {
    studentId: "2",
    studentName: "Bob Smith",
    departmentId: "CS",
    totalPoints: 920,
    averageScore: 92.0,
    examCount: 10,
    rankPosition: 2,
  },
  {
    studentId: "3",
    studentName: "Charlie Brown",
    departmentId: "CS",
    totalPoints: 880,
    averageScore: 88.0,
    examCount: 10,
    rankPosition: 3,
  },
  {
    studentId: "4",
    studentName: "Diana Prince",
    departmentId: "CS",
    totalPoints: 850,
    averageScore: 85.0,
    examCount: 10,
    rankPosition: 4,
  },
  {
    studentId: "5",
    studentName: "Eve Martinez",
    departmentId: "CS",
    totalPoints: 820,
    averageScore: 82.0,
    examCount: 10,
    rankPosition: 5,
  },
];

export function LeaderboardCardExample() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Normal State</h2>
        <LeaderboardCard entries={sampleEntries} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">With Current User Highlighted</h2>
        <LeaderboardCard entries={sampleEntries} currentUserId="3" />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Loading State</h2>
        <LeaderboardCard entries={[]} isLoading={true} />
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Empty State</h2>
        <LeaderboardCard entries={[]} isLoading={false} />
      </div>
    </div>
  );
}
