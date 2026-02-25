# Firestore Security Rules Update Required

The "Missing or insufficient permissions" error occurs because the Firestore database rules block access to the new `departments` collection by default. You need to update the rules to allow administrators to manage departments AND allow public read access for signup.

## Option 1: Update via Firebase Console (Recommended)

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project.
3. Navigate to **Firestore Database** > **Rules**.
4. Replace the existing rules with the following code:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // --- Helper Functions ---

    // Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }

    // Check if the requesting user matches the userId
    function isUser(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Check if the user has the 'admin' role
    // We check existence first to avoid errors on missing profiles
    function isAdmin() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // --- Users Collection ---
    match /users/{userId} {
      // Allow users to read their own profile, Admins can read all
      allow read: if isUser(userId) || isAdmin();
      
      // Allow users to create/update their own profile (e.g. on signup)
      // Allow admins to manage any profile
      allow write: if isUser(userId) || isAdmin();
    }

    // --- Exams Collection ---
    match /exams/{examId} {
      // Helper to check if user is the creator of the exam
      function isExamCreator() {
        return isAuthenticated() && resource.data.createdBy == request.auth.uid;
      }

      // Allow authenticated users to read exams (needed for dashboard list)
      allow read: if isAuthenticated();
      
      // Allow admins OR the creator to manage exams
      // For create: User must be admin OR set createdBy to themselves
      allow create: if isAdmin() || (isAuthenticated() && request.resource.data.createdBy == request.auth.uid);
      allow update: if isAdmin() || isExamCreator();
      allow delete: if isAdmin() || isExamCreator();

      // -- Questions Subcollection --
      match /questions/{questionId} {
        function isParentExamCreator() {
          return isAuthenticated() && get(/databases/$(database)/documents/exams/$(examId)).data.createdBy == request.auth.uid;
        }
        allow read: if isAuthenticated();
        allow write: if isAdmin() || isParentExamCreator();
      }

      // -- Blocked Students Subcollection --
      match /blockedStudents/{studentId} {
        function isParentExamCreator() {
          return isAuthenticated() && get(/databases/$(database)/documents/exams/$(examId)).data.createdBy == request.auth.uid;
        }
        allow read: if isAuthenticated(); // Students need to check if they are blocked
        allow write: if isAdmin() || isParentExamCreator();
      }
    }

    // --- Exam Attempts Collection ---
    match /examAttempts/{attemptId} {
      // Read: Student who owns the attempt or Admin
      allow read: if isAuthenticated() && (resource.data.studentId == request.auth.uid || isAdmin());
      
      // Create: Any auth user can create an attempt, but must set themselves as studentId
      allow create: if isAuthenticated() && request.resource.data.studentId == request.auth.uid;
      
      // Update: Student (submitting) or Admin
      allow update: if isAuthenticated() && (resource.data.studentId == request.auth.uid || isAdmin());

      // -- Answers Subcollection --
      match /answers/{answerId} {
        // Helper to check if the parent attempt belongs to the user
        function isAttemptOwner() {
          return get(/databases/$(database)/documents/examAttempts/$(attemptId)).data.studentId == request.auth.uid;
        }

        // Students can read/write answers for their own attempts
        allow read: if isAuthenticated() && (isAttemptOwner() || isAdmin());
        allow write: if isAuthenticated() && (isAttemptOwner() || isAdmin());
      }
    }

    // --- Departments Collection (NEW) ---
    match /departments/{departmentId} {
      // Allow public read access so users can see departments during signup
      allow read: if true;
      
      // Allow only admins to create, update, or delete departments
      allow write: if isAdmin();
    }
  }
}
```

5. Click **Publish**.

## Option 2: Deploy via CLI (If authenticated)

If you have the Firebase CLI installed and logged in, run:

```bash
firebase deploy --only firestore:rules
```
