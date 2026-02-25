import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Export functions
export { 
  calculateDepartmentLeaderboard,
  calculateGlobalDepartmentLeaderboard,
  onExamAttemptUpdate,
  refreshStaleCaches
} from './leaderboard';
