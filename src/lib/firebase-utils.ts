export class FirebaseError extends Error {
  code: string;
  
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = 'FirebaseError';
  }
}

export function handleFirebaseError(error: any): string {
  // Authentication errors
  if (error.code?.startsWith('auth/')) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Email already registered. Please login.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection.';
      default:
        return 'Authentication error. Please try again.';
    }
  }
  
  // Firestore errors
  if (error.code?.startsWith('firestore/') || error.code === 'permission-denied') {
    switch (error.code) {
      case 'permission-denied':
        return "You don't have permission for this action.";
      case 'not-found':
        return 'Resource not found.';
      case 'already-exists':
        return 'This item already exists.';
      case 'failed-precondition':
        return 'Operation cannot be completed.';
      case 'unavailable':
        return 'Service temporarily unavailable. Please retry.';
      default:
        return 'Database error. Please try again.';
    }
  }
  
  // Storage errors
  if (error.code?.startsWith('storage/')) {
    switch (error.code) {
      case 'storage/unauthorized':
        return "You don't have permission to upload files.";
      case 'storage/canceled':
        return 'Upload canceled.';
      default:
        return 'Upload failed. Please try again.';
    }
  }
  
  // Generic error
  return error.message || 'An unexpected error occurred.';
}

// Usage in components
export async function safeFirebaseCall<T>(
  operation: () => Promise<T>,
  errorCallback?: (message: string) => void
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    const message = handleFirebaseError(error);
    if (errorCallback) {
      errorCallback(message);
    } else {
      console.error(message, error);
    }
    return null;
  }
}