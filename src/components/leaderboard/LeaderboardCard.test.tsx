import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LeaderboardCard } from './LeaderboardCard';
import { LeaderboardEntry } from '@/integrations/firebase/types';
import { Timestamp } from 'firebase/firestore';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue?: string) => defaultValue || key,
    i18n: { language: 'en' }
  })
}));

const mockEntries: LeaderboardEntry[] = [
  {
    studentId: '1',
    studentName: 'Alice Johnson',
    departmentId: 'CS',
    totalPoints: 950,
    averageScore: 95.0,
    examCount: 10,
    rankPosition: 1
  },
  {
    studentId: '2',
    studentName: 'Bob Smith',
    departmentId: 'CS',
    totalPoints: 920,
    averageScore: 92.0,
    examCount: 10,
    rankPosition: 2
  },
  {
    studentId: '3',
    studentName: 'Charlie Brown',
    departmentId: 'CS',
    totalPoints: 880,
    averageScore: 88.0,
    examCount: 10,
    rankPosition: 3
  },
  {
    studentId: '4',
    studentName: 'Diana Prince',
    departmentId: 'CS',
    totalPoints: 850,
    averageScore: 85.0,
    examCount: 10,
    rankPosition: 4
  }
];

describe('LeaderboardCard', () => {
  it('renders loading state correctly', () => {
    render(<LeaderboardCard entries={[]} isLoading={true} />);
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
  });

  it('renders empty state when no entries', () => {
    render(<LeaderboardCard entries={[]} isLoading={false} />);
    expect(screen.getByText('No Rankings Yet')).toBeInTheDocument();
    expect(screen.getByText('Complete exams to appear on the leaderboard')).toBeInTheDocument();
  });

  it('renders leaderboard entries correctly', () => {
    render(<LeaderboardCard entries={mockEntries} />);
    
    // Check that all student names are rendered
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.getByText('Charlie Brown')).toBeInTheDocument();
    expect(screen.getByText('Diana Prince')).toBeInTheDocument();
  });

  it('displays points correctly', () => {
    render(<LeaderboardCard entries={mockEntries} />);
    
    expect(screen.getByText('950 pts')).toBeInTheDocument();
    expect(screen.getByText('920 pts')).toBeInTheDocument();
    expect(screen.getByText('880 pts')).toBeInTheDocument();
    expect(screen.getByText('850 pts')).toBeInTheDocument();
  });

  it('displays exam count and average score', () => {
    render(<LeaderboardCard entries={mockEntries} />);
    
    // Check for exam counts
    const examTexts = screen.getAllByText(/10 exams/);
    expect(examTexts).toHaveLength(4);
    
    // Check for average scores
    expect(screen.getByText(/Avg: 95.0%/)).toBeInTheDocument();
    expect(screen.getByText(/Avg: 92.0%/)).toBeInTheDocument();
  });

  it('highlights current user', () => {
    const { container } = render(
      <LeaderboardCard entries={mockEntries} currentUserId="2" />
    );
    
    // Check that "You" badge is displayed
    expect(screen.getByText('You')).toBeInTheDocument();
    
    // Check that the current user's entry has the ring styling
    const currentUserEntry = container.querySelector('.ring-cyan-500');
    expect(currentUserEntry).toBeInTheDocument();
  });

  it('applies special styling to top 3 entries', () => {
    const { container } = render(<LeaderboardCard entries={mockEntries} />);
    
    // Top 3 should have shadow-md class
    const topThreeEntries = container.querySelectorAll('.shadow-md');
    expect(topThreeEntries.length).toBeGreaterThanOrEqual(3);
  });

  it('displays rank position for non-top-3 entries', () => {
    render(<LeaderboardCard entries={mockEntries} />);
    
    // 4th position should be displayed as number
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('handles single entry correctly', () => {
    const singleEntry = [mockEntries[0]];
    render(<LeaderboardCard entries={singleEntry} />);
    
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('950 pts')).toBeInTheDocument();
  });
});
