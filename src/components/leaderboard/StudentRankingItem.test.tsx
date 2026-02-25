import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StudentRankingItem } from './StudentRankingItem';
import { LeaderboardEntry } from '@/integrations/firebase/types';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, defaultValue: string) => defaultValue,
  }),
}));

describe('StudentRankingItem', () => {
  const mockEntry: LeaderboardEntry = {
    studentId: 'student-1',
    studentName: 'John Doe',
    departmentId: 'dept-1',
    totalPoints: 850,
    averageScore: 85.5,
    examCount: 10,
    rankPosition: 4,
  };

  it('renders student information correctly', () => {
    render(<StudentRankingItem entry={mockEntry} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('850 pts')).toBeInTheDocument();
    expect(screen.getByText('10 exams')).toBeInTheDocument();
    expect(screen.getByText(/Avg: 85.5%/)).toBeInTheDocument();
  });

  it('displays rank position for non-top-three students', () => {
    render(<StudentRankingItem entry={mockEntry} />);
    
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('displays crown icon for first place', () => {
    const firstPlaceEntry = { ...mockEntry, rankPosition: 1 };
    const { container } = render(<StudentRankingItem entry={firstPlaceEntry} />);
    
    // Check for crown icon (lucide-react renders as svg)
    const crownIcon = container.querySelector('svg');
    expect(crownIcon).toBeInTheDocument();
  });

  it('displays trophy icon for second place', () => {
    const secondPlaceEntry = { ...mockEntry, rankPosition: 2 };
    const { container } = render(<StudentRankingItem entry={secondPlaceEntry} />);
    
    const trophyIcon = container.querySelector('svg');
    expect(trophyIcon).toBeInTheDocument();
  });

  it('displays medal icon for third place', () => {
    const thirdPlaceEntry = { ...mockEntry, rankPosition: 3 };
    const { container } = render(<StudentRankingItem entry={thirdPlaceEntry} />);
    
    const medalIcon = container.querySelector('svg');
    expect(medalIcon).toBeInTheDocument();
  });

  it('highlights current user with "You" badge', () => {
    render(<StudentRankingItem entry={mockEntry} isCurrentUser={true} />);
    
    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('does not show "You" badge for other users', () => {
    render(<StudentRankingItem entry={mockEntry} isCurrentUser={false} />);
    
    expect(screen.queryByText('You')).not.toBeInTheDocument();
  });

  it('displays progress bar when nextRankPoints is provided', () => {
    render(<StudentRankingItem entry={mockEntry} nextRankPoints={1000} />);
    
    expect(screen.getByText('Next rank')).toBeInTheDocument();
    expect(screen.getByText('150 pts needed')).toBeInTheDocument();
  });

  it('calculates progress percentage correctly', () => {
    const { container } = render(
      <StudentRankingItem entry={mockEntry} nextRankPoints={1000} />
    );
    
    // 850 / 1000 = 85%
    const progressBar = container.querySelector('[style*="width: 85%"]');
    expect(progressBar).toBeInTheDocument();
  });

  it('does not show progress bar when nextRankPoints is not provided', () => {
    render(<StudentRankingItem entry={mockEntry} />);
    
    expect(screen.queryByText('Next rank')).not.toBeInTheDocument();
  });

  it('shows top rank message for first place with no points needed', () => {
    const firstPlaceEntry = { ...mockEntry, rankPosition: 1, totalPoints: 1000 };
    render(<StudentRankingItem entry={firstPlaceEntry} nextRankPoints={1000} />);
    
    expect(screen.getByText(/You're at the top!/)).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    const { container } = render(
      <StudentRankingItem entry={mockEntry} className="custom-class" />
    );
    
    const itemElement = container.firstChild;
    expect(itemElement).toHaveClass('custom-class');
  });

  it('applies special styling for top three students', () => {
    const topThreeEntry = { ...mockEntry, rankPosition: 2 };
    const { container } = render(<StudentRankingItem entry={topThreeEntry} />);
    
    const itemElement = container.firstChild;
    expect(itemElement).toHaveClass('shadow-md');
  });

  it('applies ring styling for current user', () => {
    const { container } = render(
      <StudentRankingItem entry={mockEntry} isCurrentUser={true} />
    );
    
    const itemElement = container.firstChild;
    expect(itemElement).toHaveClass('ring-2', 'ring-cyan-500');
  });

  it('handles zero exam count', () => {
    const noExamsEntry = { ...mockEntry, examCount: 0 };
    render(<StudentRankingItem entry={noExamsEntry} />);
    
    expect(screen.getByText('0 exams')).toBeInTheDocument();
  });

  it('handles decimal average scores', () => {
    const decimalScoreEntry = { ...mockEntry, averageScore: 92.7 };
    render(<StudentRankingItem entry={decimalScoreEntry} />);
    
    expect(screen.getByText(/Avg: 92.7%/)).toBeInTheDocument();
  });

  it('does not show progress bar when points exceed next rank', () => {
    const highPointsEntry = { ...mockEntry, totalPoints: 1200 };
    render(
      <StudentRankingItem entry={highPointsEntry} nextRankPoints={1000} />
    );
    
    // Should not show progress bar when points exceed next rank (pointsToNextRank <= 0)
    expect(screen.queryByText('Next rank')).not.toBeInTheDocument();
  });
});
