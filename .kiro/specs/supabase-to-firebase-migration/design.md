# Design Document: Supabase to Firebase Migration

## Overview

This document outlines the comprehensive technical design for migrating the online exam management system from Supabase (PostgreSQL + Auth + Storage) to Firebase (Firestore + Auth + Storage). The migration preserves all existing functionality while adapting the relational database structure to Firestore's NoSQL document-based model. The design includes data model transformation, authentication migration, security rules, code architecture changes, and a phased migration strategy with rollback capabilities.

## Architecture

### Current Architecture (Supabase)

```mermaid
graph TD
    A[React App] --> B[Supabase Client]
    B --> C[PostgreSQL Database]
    B --> D[Supabase Auth]
    B --> E[Supabase Storage]
    C --> F[Row Level Security]
    D --> G[JWT Tokens]
```

### Target Architecture (Firebase)

```mermaid
graph TD
    A[React App] --> B[Firebase SDK]
    B --> C[Firestore Database]
    B --> D[Firebase Auth]
    B --> E[Firebase Storage]
    C --> F[Security Rules]
    D --> G[Custom Claims + Firestore]
    D --> H[ID Tokens]
```


## Main Data Flow

```mermaid
sequenceDiagram
    participant User
    participant React App
    participant Firebase Auth
    participant Firestore
    participant Storage
    
    User->>React App: Login
    React App->>Firebase Auth: signInWithEmailAndPassword()
    Firebase Auth-->>React App: User + ID Token
    React App->>Firestore: Get user profile & role
    Firestore-->>React App: Profile data
    
    User->>React App: Take Exam
    React App->>Firestore: Create exam attempt
    React App->>Firestore: Save answers (real-time)
    React App->>Firestore: Submit attempt
    Firestore-->>React App: Results (if published)
    
    User->>React App: Upload image
    React App->>Storage: Upload file
    Storage-->>React App: Download URL
    React App->>Firestore: Save URL in document
```

## Firestore Data Model

### Collection Structure Overview


**Design Decision: Flat vs Nested Collections**

Firestore supports both top-level collections and subcollections. For this migration:
- **Top-level collections**: `users`, `exams`, `examAttempts`
- **Subcollections**: `questions` (under exams), `answers` (under examAttempts), `blockedStudents` (under exams)

**Rationale**:
- Questions are tightly coupled to exams and always queried together
- Answers are tightly coupled to attempts and never queried independently
- Blocked students are exam-specific and benefit from hierarchical organization
- Top-level collections for entities that need cross-document queries (attempts across exams)

```mermaid
graph TD
    A[users/] --> B[userId]
    B --> C[Profile Data]
    B --> D[role: admin/student]
    
    E[exams/] --> F[examId]
    F --> G[Exam Metadata]
    F --> H[questions/]
    H --> I[questionId]
    F --> J[blockedStudents/]
    J --> K[studentId]
    
    L[examAttempts/] --> M[attemptId]
    M --> N[Attempt Data]
    M --> O[answers/]
    O --> P[questionId]
```


### Collection: users

**Path**: `/users/{userId}`

**Document Schema**:
```typescript
interface UserDocument {
  userId: string;              // Firebase Auth UID
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: 'admin' | 'student';   // Denormalized from user_roles
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Indexes Required**:
- `email` (ascending) - for user lookup
- `role` (ascending) - for filtering by role

**Migration Notes**:
- Combines `profiles` and `user_roles` tables into single document
- `userId` matches Firebase Auth UID
- Role denormalized for faster access (no joins needed)

### Collection: exams

**Path**: `/exams/{examId}`

**Document Schema**:
```typescript
interface ExamDocument {
  examId: string;
  title: string;
  description: string | null;
  createdBy: string;           // userId reference
  durationMinutes: number;
  maxAttempts: number;
  isPublished: boolean;
  resultsPublished: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  startTime: Timestamp | null;
  endTime: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  
  // Computed fields for optimization
  questionCount: number;       // Denormalized
  totalMarks: number;          // Denormalized
}
```

**Indexes Required**:
- `createdBy` (ascending) + `createdAt` (descending) - for admin's exams
- `isPublished` (ascending) + `startTime` (ascending) - for student exam list
- `isPublished` (ascending) + `endTime` (descending) - for filtering active exams


### Subcollection: exams/{examId}/questions

**Path**: `/exams/{examId}/questions/{questionId}`

**Document Schema**:
```typescript
interface QuestionDocument {
  questionId: string;
  examId: string;              // Parent reference (denormalized)
  questionText: string;
  options: string[];           // Array of option strings
  correctOptionIndex: number;
  marks: number;
  orderIndex: number;
  feedbackType: 'instant' | 'hidden';
  createdAt: Timestamp;
}
```

**Indexes Required**:
- `orderIndex` (ascending) - for ordered retrieval

**Design Decision**: Subcollection vs Array
- **Chosen**: Subcollection
- **Rationale**: Questions can be large (100+ per exam), subcollections allow pagination and individual updates
- **Alternative**: Store as array in exam document (rejected due to 1MB document size limit)

### Subcollection: exams/{examId}/blockedStudents

**Path**: `/exams/{examId}/blockedStudents/{studentId}`

**Document Schema**:
```typescript
interface BlockedStudentDocument {
  studentId: string;           // userId reference
  examId: string;              // Parent reference (denormalized)
  reason: string | null;
  blockedAt: Timestamp;
}
```

**Indexes Required**: None (queries always scoped to examId)


### Collection: examAttempts

**Path**: `/examAttempts/{attemptId}`

**Document Schema**:
```typescript
interface ExamAttemptDocument {
  attemptId: string;
  examId: string;              // Reference to exam
  studentId: string;           // Reference to user
  startedAt: Timestamp;
  submittedAt: Timestamp | null;
  isSubmitted: boolean;
  timeSpentSeconds: number | null;
  totalScore: number | null;
  maxScore: number | null;
  createdAt: Timestamp;
  
  // Denormalized for queries
  examTitle: string;           // From exam
  studentName: string;         // From user
  studentEmail: string;        // From user
}
```

**Indexes Required**:
- `studentId` (ascending) + `createdAt` (descending) - for student's attempts
- `examId` (ascending) + `submittedAt` (descending) - for exam results
- `examId` (ascending) + `isSubmitted` (ascending) - for filtering submitted attempts
- Composite: `studentId` + `examId` + `isSubmitted` - for checking active attempts

**Design Decision**: Denormalization
- Store `examTitle`, `studentName`, `studentEmail` in attempt document
- **Rationale**: Avoid multiple reads when displaying results lists
- **Trade-off**: Must update attempts if exam title or student name changes (rare)

### Subcollection: examAttempts/{attemptId}/answers

**Path**: `/examAttempts/{attemptId}/answers/{questionId}`

**Document Schema**:
```typescript
interface AnswerDocument {
  questionId: string;          // Also used as document ID
  attemptId: string;           // Parent reference (denormalized)
  selectedOptionIndex: number | null;
  isCorrect: boolean | null;
  timeSpentSeconds: number | null;
  answeredAt: Timestamp | null;
}
```

**Indexes Required**: None (queries always scoped to attemptId)

**Design Decision**: Document ID = questionId
- **Rationale**: Enables upsert pattern (set with merge) for real-time answer saving
- **Benefit**: No duplicate answers, easy to update existing answer


## Components and Interfaces

### Component 1: Firebase Service Layer

**Purpose**: Centralized Firebase SDK initialization and configuration

**Interface**:
```typescript
// src/integrations/firebase/client.ts
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

class FirebaseService {
  private app: FirebaseApp;
  public auth: Auth;
  public db: Firestore;
  public storage: FirebaseStorage;
  
  constructor(config: FirebaseConfig);
  initialize(): void;
  getApp(): FirebaseApp;
}

export const firebase: FirebaseService;
export const auth: Auth;
export const db: Firestore;
export const storage: FirebaseStorage;
```

**Responsibilities**:
- Initialize Firebase app with configuration
- Provide singleton instances of Auth, Firestore, Storage
- Handle Firebase SDK setup and error handling
- Enable offline persistence for Firestore


### Component 2: Authentication Service

**Purpose**: Handle user authentication, role management, and profile operations

**Interface**:
```typescript
// src/lib/firebase-auth.ts
import { User, UserCredential } from 'firebase/auth';

export type AppRole = 'admin' | 'student';

export interface UserProfile {
  userId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role: AppRole;
  createdAt: Date;
  updatedAt: Date;
}

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: AppRole
): Promise<UserCredential>;

export async function signIn(
  email: string,
  password: string
): Promise<UserCredential>;

export async function signOut(): Promise<void>;

export async function getCurrentUser(): Promise<User | null>;

export async function getUserProfile(userId: string): Promise<UserProfile | null>;

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<void>;

export async function resetPassword(email: string): Promise<void>;
```

**Responsibilities**:
- User registration with role assignment
- Email/password authentication
- Profile creation and management
- Password reset functionality
- Session management


### Component 3: Exam Service

**Purpose**: CRUD operations for exams and questions

**Interface**:
```typescript
// src/lib/firebase-exams.ts
import { Timestamp } from 'firebase/firestore';

export interface Exam {
  examId: string;
  title: string;
  description: string | null;
  createdBy: string;
  durationMinutes: number;
  maxAttempts: number;
  isPublished: boolean;
  resultsPublished: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  startTime: Date | null;
  endTime: Date | null;
  questionCount: number;
  totalMarks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  questionId: string;
  examId: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  marks: number;
  orderIndex: number;
  feedbackType: 'instant' | 'hidden';
  createdAt: Date;
}

export async function createExam(exam: Omit<Exam, 'examId' | 'createdAt' | 'updatedAt'>): Promise<string>;

export async function updateExam(examId: string, updates: Partial<Exam>): Promise<void>;

export async function deleteExam(examId: string): Promise<void>;

export async function getExam(examId: string): Promise<Exam | null>;

export async function getExamsByCreator(userId: string): Promise<Exam[]>;

export async function getPublishedExams(): Promise<Exam[]>;

export async function addQuestion(examId: string, question: Omit<Question, 'questionId' | 'createdAt'>): Promise<string>;

export async function updateQuestion(examId: string, questionId: string, updates: Partial<Question>): Promise<void>;

export async function deleteQuestion(examId: string, questionId: string): Promise<void>;

export async function getQuestions(examId: string): Promise<Question[]>;

export async function blockStudent(examId: string, studentId: string, reason?: string): Promise<void>;

export async function unblockStudent(examId: string, studentId: string): Promise<void>;

export async function isStudentBlocked(examId: string, studentId: string): Promise<boolean>;
```

**Responsibilities**:
- Exam CRUD operations with validation
- Question management within exams
- Student blocking/unblocking
- Query optimization with proper indexing
- Denormalized field updates (questionCount, totalMarks)


### Component 4: Exam Attempt Service

**Purpose**: Manage exam attempts and student answers

**Interface**:
```typescript
// src/lib/firebase-attempts.ts

export interface ExamAttempt {
  attemptId: string;
  examId: string;
  studentId: string;
  startedAt: Date;
  submittedAt: Date | null;
  isSubmitted: boolean;
  timeSpentSeconds: number | null;
  totalScore: number | null;
  maxScore: number | null;
  examTitle: string;
  studentName: string;
  studentEmail: string;
  createdAt: Date;
}

export interface Answer {
  questionId: string;
  attemptId: string;
  selectedOptionIndex: number | null;
  isCorrect: boolean | null;
  timeSpentSeconds: number | null;
  answeredAt: Date | null;
}

export async function createAttempt(
  examId: string,
  studentId: string,
  examTitle: string,
  studentName: string,
  studentEmail: string
): Promise<string>;

export async function getAttempt(attemptId: string): Promise<ExamAttempt | null>;

export async function getStudentAttempts(studentId: string, examId?: string): Promise<ExamAttempt[]>;

export async function getExamAttempts(examId: string): Promise<ExamAttempt[]>;

export async function getAttemptCount(studentId: string, examId: string): Promise<number>;

export async function saveAnswer(
  attemptId: string,
  questionId: string,
  answer: Omit<Answer, 'attemptId' | 'questionId'>
): Promise<void>;

export async function getAnswers(attemptId: string): Promise<Answer[]>;

export async function submitAttempt(
  attemptId: string,
  totalScore: number,
  maxScore: number,
  timeSpentSeconds: number
): Promise<void>;

export async function calculateScore(attemptId: string, questions: Question[]): Promise<{ totalScore: number; maxScore: number }>;
```

**Responsibilities**:
- Create and manage exam attempts
- Real-time answer saving with upsert pattern
- Attempt submission and scoring
- Query student's attempt history
- Enforce max attempts limit


### Component 5: Storage Service

**Purpose**: Handle file uploads and downloads (avatars, exam images)

**Interface**:
```typescript
// src/lib/firebase-storage.ts

export interface UploadResult {
  url: string;
  path: string;
  fullPath: string;
}

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<UploadResult>;

export async function uploadExamImage(
  examId: string,
  file: File
): Promise<UploadResult>;

export async function deleteFile(path: string): Promise<void>;

export async function getDownloadURL(path: string): Promise<string>;
```

**Responsibilities**:
- Upload files to Firebase Storage
- Generate and return download URLs
- Organize files by type (avatars/, exam-images/)
- Handle file deletion
- Validate file types and sizes


## Key Functions with Formal Specifications

### Function 1: signUp()

```typescript
async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: AppRole
): Promise<UserCredential>
```

**Preconditions:**
- `email` is valid email format and non-empty
- `password` meets minimum length requirement (6+ characters)
- `fullName` is non-empty string
- `role` is either 'admin' or 'student'
- Email is not already registered in Firebase Auth

**Postconditions:**
- User created in Firebase Auth with UID
- User document created in `/users/{userId}` collection
- User document contains all profile fields including role
- Returns UserCredential with user object
- If any step fails, entire operation rolls back (Auth user deleted if Firestore write fails)

**Error Handling:**
- `auth/email-already-in-use`: Email already registered
- `auth/invalid-email`: Invalid email format
- `auth/weak-password`: Password too weak
- `firestore/permission-denied`: Security rules violation


### Function 2: createExam()

```typescript
async function createExam(
  exam: Omit<Exam, 'examId' | 'createdAt' | 'updatedAt'>
): Promise<string>
```

**Preconditions:**
- `exam.title` is non-empty string
- `exam.durationMinutes` is positive integer
- `exam.maxAttempts` is positive integer
- `exam.createdBy` is valid userId that exists in users collection
- User with `exam.createdBy` has role 'admin'
- If `exam.startTime` and `exam.endTime` are provided, `endTime > startTime`

**Postconditions:**
- New exam document created in `/exams/{examId}` with auto-generated ID
- `createdAt` and `updatedAt` set to current timestamp
- `questionCount` initialized to 0
- `totalMarks` initialized to 0
- Returns the generated examId
- Document is immediately queryable

**Loop Invariants:** N/A (no loops)

**Error Handling:**
- `firestore/permission-denied`: User not authenticated or not admin
- `firestore/invalid-argument`: Invalid field values


### Function 3: saveAnswer()

```typescript
async function saveAnswer(
  attemptId: string,
  questionId: string,
  answer: Omit<Answer, 'attemptId' | 'questionId'>
): Promise<void>
```

**Preconditions:**
- `attemptId` references existing exam attempt document
- `questionId` references existing question in the exam
- Attempt with `attemptId` has `isSubmitted === false`
- `answer.selectedOptionIndex` is within valid range for question options (if not null)
- User making request is the student who owns the attempt

**Postconditions:**
- Answer document created or updated at `/examAttempts/{attemptId}/answers/{questionId}`
- If answer already exists, it is overwritten (upsert behavior)
- `answeredAt` timestamp updated to current time
- No changes to parent attempt document
- Operation completes in <100ms for real-time UX

**Loop Invariants:** N/A (no loops)

**Error Handling:**
- `firestore/permission-denied`: User not authorized or attempt already submitted
- `firestore/not-found`: Attempt or question doesn't exist


### Function 4: submitAttempt()

```typescript
async function submitAttempt(
  attemptId: string,
  totalScore: number,
  maxScore: number,
  timeSpentSeconds: number
): Promise<void>
```

**Preconditions:**
- `attemptId` references existing exam attempt document
- Attempt with `attemptId` has `isSubmitted === false`
- `totalScore >= 0` and `totalScore <= maxScore`
- `maxScore > 0`
- `timeSpentSeconds >= 0`
- User making request is the student who owns the attempt

**Postconditions:**
- Attempt document updated with:
  - `isSubmitted = true`
  - `submittedAt = current timestamp`
  - `totalScore = provided score`
  - `maxScore = provided max score`
  - `timeSpentSeconds = provided time`
- Once submitted, attempt cannot be modified (immutable)
- All answer documents remain unchanged
- Student can view results if `exam.resultsPublished === true`

**Loop Invariants:** N/A (no loops)

**Error Handling:**
- `firestore/permission-denied`: User not authorized or attempt already submitted
- `firestore/failed-precondition`: Attempt already submitted (idempotency check)


## Algorithmic Pseudocode

### Main Authentication Flow

```typescript
ALGORITHM authenticateUser(email, password)
INPUT: email (string), password (string)
OUTPUT: { user, profile, role } or error

BEGIN
  // Step 1: Authenticate with Firebase Auth
  userCredential ← signInWithEmailAndPassword(auth, email, password)
  user ← userCredential.user
  
  ASSERT user !== null AND user.uid !== null
  
  // Step 2: Fetch user profile from Firestore
  userDoc ← getDoc(doc(db, 'users', user.uid))
  
  IF NOT userDoc.exists() THEN
    // Profile not found - data inconsistency
    THROW Error("User profile not found")
  END IF
  
  profile ← userDoc.data()
  role ← profile.role
  
  ASSERT role IN ['admin', 'student']
  
  // Step 3: Return authenticated user data
  RETURN {
    user: user,
    profile: profile,
    role: role
  }
END
```

**Preconditions:**
- Firebase Auth initialized
- Firestore connection established
- Email and password are non-empty strings

**Postconditions:**
- User authenticated with valid session
- Profile data loaded from Firestore
- Role verified as admin or student
- ID token available for subsequent requests

**Error Cases:**
- Invalid credentials → `auth/wrong-password` or `auth/user-not-found`
- Network failure → `auth/network-request-failed`
- Profile missing → Custom error with cleanup


### Exam Attempt Creation with Validation

```typescript
ALGORITHM createExamAttempt(examId, studentId)
INPUT: examId (string), studentId (string)
OUTPUT: attemptId (string) or error

BEGIN
  // Step 1: Validate exam exists and is accessible
  examDoc ← getDoc(doc(db, 'exams', examId))
  
  IF NOT examDoc.exists() THEN
    THROW Error("Exam not found")
  END IF
  
  exam ← examDoc.data()
  
  // Step 2: Check exam availability
  currentTime ← now()
  
  IF exam.isPublished === false THEN
    THROW Error("Exam not published")
  END IF
  
  IF exam.startTime !== null AND currentTime < exam.startTime THEN
    THROW Error("Exam not started yet")
  END IF
  
  IF exam.endTime !== null AND currentTime > exam.endTime THEN
    THROW Error("Exam has ended")
  END IF
  
  // Step 3: Check if student is blocked
  blockedDoc ← getDoc(doc(db, 'exams', examId, 'blockedStudents', studentId))
  
  IF blockedDoc.exists() THEN
    THROW Error("Student is blocked from this exam")
  END IF
  
  // Step 4: Check attempt limit
  attemptsQuery ← query(
    collection(db, 'examAttempts'),
    where('examId', '==', examId),
    where('studentId', '==', studentId)
  )
  
  existingAttempts ← getDocs(attemptsQuery)
  attemptCount ← existingAttempts.size
  
  IF attemptCount >= exam.maxAttempts THEN
    THROW Error("Maximum attempts reached")
  END IF
  
  // Step 5: Get student profile for denormalization
  studentDoc ← getDoc(doc(db, 'users', studentId))
  student ← studentDoc.data()
  
  // Step 6: Create attempt document
  attemptData ← {
    examId: examId,
    studentId: studentId,
    examTitle: exam.title,
    studentName: student.fullName,
    studentEmail: student.email,
    startedAt: currentTime,
    submittedAt: null,
    isSubmitted: false,
    timeSpentSeconds: null,
    totalScore: null,
    maxScore: null,
    createdAt: currentTime
  }
  
  attemptRef ← addDoc(collection(db, 'examAttempts'), attemptData)
  
  RETURN attemptRef.id
END
```

**Preconditions:**
- `examId` references valid exam document
- `studentId` references valid user with role 'student'
- User is authenticated

**Postconditions:**
- New attempt created if all validations pass
- Attempt count incremented for student
- Attempt is in active state (not submitted)
- Returns unique attemptId

**Loop Invariants:** N/A (no loops)


### Batch Question Update with Denormalization

```typescript
ALGORITHM updateExamQuestions(examId, questions)
INPUT: examId (string), questions (array of Question objects)
OUTPUT: void or error

BEGIN
  // Step 1: Start batch write for atomicity
  batch ← writeBatch(db)
  
  // Step 2: Get existing questions to determine deletes
  existingQuestionsSnapshot ← getDocs(
    collection(db, 'exams', examId, 'questions')
  )
  
  existingQuestionIds ← new Set()
  FOR EACH doc IN existingQuestionsSnapshot.docs DO
    existingQuestionIds.add(doc.id)
  END FOR
  
  // Step 3: Process new/updated questions
  newQuestionIds ← new Set()
  totalMarks ← 0
  
  FOR EACH question IN questions DO
    ASSERT question.marks > 0
    ASSERT question.options.length >= 2
    ASSERT question.correctOptionIndex >= 0 AND 
           question.correctOptionIndex < question.options.length
    
    totalMarks ← totalMarks + question.marks
    
    IF question.questionId EXISTS THEN
      // Update existing question
      questionRef ← doc(db, 'exams', examId, 'questions', question.questionId)
      batch.update(questionRef, question)
      newQuestionIds.add(question.questionId)
    ELSE
      // Create new question
      questionRef ← doc(collection(db, 'exams', examId, 'questions'))
      batch.set(questionRef, {
        ...question,
        questionId: questionRef.id,
        examId: examId,
        createdAt: now()
      })
      newQuestionIds.add(questionRef.id)
    END IF
  END FOR
  
  // Step 4: Delete removed questions
  FOR EACH existingId IN existingQuestionIds DO
    IF existingId NOT IN newQuestionIds THEN
      questionRef ← doc(db, 'exams', examId, 'questions', existingId)
      batch.delete(questionRef)
    END IF
  END FOR
  
  // Step 5: Update exam's denormalized fields
  examRef ← doc(db, 'exams', examId)
  batch.update(examRef, {
    questionCount: questions.length,
    totalMarks: totalMarks,
    updatedAt: now()
  })
  
  // Step 6: Commit batch atomically
  AWAIT batch.commit()
END
```

**Preconditions:**
- `examId` references valid exam document
- User is admin and owns the exam
- All questions have valid data (marks > 0, options array, valid correctOptionIndex)
- No active attempts exist for this exam (or accept that scores may be inconsistent)

**Postconditions:**
- All questions updated/created/deleted atomically
- Exam's `questionCount` and `totalMarks` updated correctly
- If batch fails, no changes applied (all-or-nothing)
- Exam's `updatedAt` timestamp updated

**Loop Invariants:**
- `totalMarks` accumulates correctly for all processed questions
- `newQuestionIds` contains IDs of all questions that should exist after update
- All questions maintain valid structure throughout iteration


## Example Usage

### Example 1: User Registration and Login

```typescript
import { signUp, signIn, getUserProfile } from '@/lib/firebase-auth';

// Register new student
async function registerStudent() {
  try {
    const credential = await signUp(
      'student@example.com',
      'securePassword123',
      'John Doe',
      'student'
    );
    
    console.log('User created:', credential.user.uid);
    
    // Profile automatically created in Firestore
    const profile = await getUserProfile(credential.user.uid);
    console.log('Profile:', profile);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.error('Email already registered');
    }
  }
}

// Login existing user
async function loginUser() {
  try {
    const credential = await signIn('student@example.com', 'securePassword123');
    const profile = await getUserProfile(credential.user.uid);
    
    console.log('Logged in as:', profile.fullName);
    console.log('Role:', profile.role);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}
```


### Example 2: Creating Exam with Questions

```typescript
import { createExam, addQuestion } from '@/lib/firebase-exams';

async function createCompleteExam(adminUserId: string) {
  try {
    // Create exam
    const examId = await createExam({
      title: 'JavaScript Fundamentals',
      description: 'Test your JavaScript knowledge',
      createdBy: adminUserId,
      durationMinutes: 60,
      maxAttempts: 3,
      isPublished: false,
      resultsPublished: false,
      shuffleQuestions: true,
      shuffleOptions: true,
      startTime: new Date('2024-01-15T09:00:00'),
      endTime: new Date('2024-01-15T18:00:00'),
      questionCount: 0,
      totalMarks: 0
    });
    
    console.log('Exam created:', examId);
    
    // Add questions
    const question1Id = await addQuestion(examId, {
      examId: examId,
      questionText: 'What is a closure in JavaScript?',
      options: [
        'A function inside another function',
        'A way to close the browser',
        'A type of loop',
        'A CSS property'
      ],
      correctOptionIndex: 0,
      marks: 5,
      orderIndex: 0,
      feedbackType: 'instant'
    });
    
    const question2Id = await addQuestion(examId, {
      examId: examId,
      questionText: 'Which keyword declares a constant?',
      options: ['var', 'let', 'const', 'static'],
      correctOptionIndex: 2,
      marks: 3,
      orderIndex: 1,
      feedbackType: 'hidden'
    });
    
    console.log('Questions added:', [question1Id, question2Id]);
    
    // Publish exam
    await updateExam(examId, { isPublished: true });
    
  } catch (error) {
    console.error('Error creating exam:', error);
  }
}
```


### Example 3: Taking Exam with Real-time Answer Saving

```typescript
import { createAttempt, saveAnswer, submitAttempt, getQuestions } from '@/lib/firebase-attempts';

async function takeExam(examId: string, studentId: string) {
  try {
    // Start attempt
    const attemptId = await createAttempt(
      examId,
      studentId,
      'JavaScript Fundamentals',
      'John Doe',
      'student@example.com'
    );
    
    console.log('Attempt started:', attemptId);
    
    // Get questions
    const questions = await getQuestions(examId);
    
    // Answer questions (with real-time saving)
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      
      // Student selects answer
      const selectedIndex = 0; // User's choice
      
      // Save immediately (upsert pattern)
      await saveAnswer(attemptId, question.questionId, {
        selectedOptionIndex: selectedIndex,
        isCorrect: selectedIndex === question.correctOptionIndex,
        timeSpentSeconds: 45,
        answeredAt: new Date()
      });
      
      console.log(`Question ${i + 1} answered`);
    }
    
    // Calculate score
    const answers = await getAnswers(attemptId);
    let totalScore = 0;
    let maxScore = 0;
    
    for (const question of questions) {
      maxScore += question.marks;
      const answer = answers.find(a => a.questionId === question.questionId);
      if (answer?.isCorrect) {
        totalScore += question.marks;
      }
    }
    
    // Submit attempt
    await submitAttempt(attemptId, totalScore, maxScore, 3600);
    
    console.log(`Exam submitted: ${totalScore}/${maxScore}`);
    
  } catch (error) {
    console.error('Error taking exam:', error);
  }
}
```


### Example 4: Querying Results with Denormalized Data

```typescript
import { getExamAttempts } from '@/lib/firebase-attempts';
import { query, collection, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';

async function getExamResults(examId: string) {
  try {
    // Query all submitted attempts for an exam
    const attemptsQuery = query(
      collection(db, 'examAttempts'),
      where('examId', '==', examId),
      where('isSubmitted', '==', true),
      orderBy('submittedAt', 'desc')
    );
    
    const snapshot = await getDocs(attemptsQuery);
    
    const results = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        attemptId: doc.id,
        studentName: data.studentName,      // Denormalized - no extra query needed
        studentEmail: data.studentEmail,    // Denormalized - no extra query needed
        score: data.totalScore,
        maxScore: data.maxScore,
        percentage: (data.totalScore / data.maxScore) * 100,
        submittedAt: data.submittedAt.toDate()
      };
    });
    
    console.log('Results:', results);
    return results;
    
  } catch (error) {
    console.error('Error fetching results:', error);
  }
}

// Get student's attempt history
async function getStudentHistory(studentId: string) {
  const attemptsQuery = query(
    collection(db, 'examAttempts'),
    where('studentId', '==', studentId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(attemptsQuery);
  
  return snapshot.docs.map(doc => ({
    attemptId: doc.id,
    examTitle: doc.data().examTitle,      // Denormalized - no extra query needed
    score: doc.data().totalScore,
    submittedAt: doc.data().submittedAt?.toDate()
  }));
}
```


## Firestore Security Rules

### Complete Security Rules Configuration

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isStudent() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'student';
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      // Anyone can read user profiles (for displaying names)
      allow read: if isAuthenticated();
      
      // Only the user can create their own profile during signup
      allow create: if isOwner(userId) && 
                      request.resource.data.userId == userId &&
                      request.resource.data.role in ['admin', 'student'];
      
      // Only the user can update their own profile
      allow update: if isOwner(userId) && 
                      request.resource.data.role == resource.data.role; // Can't change role
      
      // No deletes allowed
      allow delete: if false;
    }
    
    // Exams collection
    match /exams/{examId} {
      // Admins can read all exams, students can read published exams
      allow read: if isAdmin() || 
                    (isStudent() && resource.data.isPublished == true);
      
      // Only admins can create exams
      allow create: if isAdmin() && 
                      request.resource.data.createdBy == request.auth.uid;
      
      // Only exam creator can update
      allow update: if isAdmin() && 
                      resource.data.createdBy == request.auth.uid;
      
      // Only exam creator can delete
      allow delete: if isAdmin() && 
                      resource.data.createdBy == request.auth.uid;
      
      // Questions subcollection
      match /questions/{questionId} {
        // Admins can read all questions
        // Students can read questions only if exam is published
        allow read: if isAdmin() || 
                      (isStudent() && 
                       get(/databases/$(database)/documents/exams/$(examId)).data.isPublished == true);
        
        // Only exam creator can write questions
        allow write: if isAdmin() && 
                       get(/databases/$(database)/documents/exams/$(examId)).data.createdBy == request.auth.uid;
      }
      
      // Blocked students subcollection
      match /blockedStudents/{studentId} {
        // Admins can read, students can check if they're blocked
        allow read: if isAdmin() || isOwner(studentId);
        
        // Only exam creator can block/unblock students
        allow write: if isAdmin() && 
                       get(/databases/$(database)/documents/exams/$(examId)).data.createdBy == request.auth.uid;
      }
    }
    
    // Exam attempts collection
    match /examAttempts/{attemptId} {
      // Students can read their own attempts
      // Admins can read all attempts
      allow read: if isAdmin() || 
                    (isStudent() && resource.data.studentId == request.auth.uid);
      
      // Students can create attempts for themselves
      allow create: if isStudent() && 
                      request.resource.data.studentId == request.auth.uid &&
                      request.resource.data.isSubmitted == false;
      
      // Students can update their own unsubmitted attempts
      // Once submitted, attempts are immutable
      allow update: if isStudent() && 
                      resource.data.studentId == request.auth.uid &&
                      resource.data.isSubmitted == false;
      
      // No deletes allowed
      allow delete: if false;
      
      // Answers subcollection
      match /answers/{questionId} {
        // Students can read their own answers
        // Admins can read all answers
        allow read: if isAdmin() || 
                      (isStudent() && 
                       get(/databases/$(database)/documents/examAttempts/$(attemptId)).data.studentId == request.auth.uid);
        
        // Students can write answers to their own unsubmitted attempts
        allow write: if isStudent() && 
                       get(/databases/$(database)/documents/examAttempts/$(attemptId)).data.studentId == request.auth.uid &&
                       get(/databases/$(database)/documents/examAttempts/$(attemptId)).data.isSubmitted == false;
      }
    }
  }
}
```


### Security Rules Explanation

**Key Differences from Supabase RLS:**

1. **Role Checking**: Instead of database-level role functions, we read the role from the user document
2. **Subcollection Access**: Rules cascade but can be overridden for subcollections
3. **No Joins**: Security rules can't perform joins, so we use `get()` to fetch related documents
4. **Performance**: Each `get()` call counts toward read quota, so minimize them

**Security Principles:**
- Admins have full access to exams they created
- Students can only access published exams
- Students can only modify their own unsubmitted attempts
- Submitted attempts are immutable
- Role changes are prevented (role field is immutable after creation)


## Firebase Storage Security Rules

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isImageFile() {
      return request.resource.contentType.matches('image/.*');
    }
    
    function isValidSize() {
      return request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
    
    // Avatar images
    match /avatars/{userId}/{fileName} {
      // Anyone authenticated can read avatars
      allow read: if isAuthenticated();
      
      // Users can only upload their own avatar
      allow write: if isAuthenticated() && 
                     request.auth.uid == userId &&
                     isImageFile() &&
                     isValidSize();
    }
    
    // Exam images (for questions)
    match /exam-images/{examId}/{fileName} {
      // Anyone authenticated can read exam images
      allow read: if isAuthenticated();
      
      // Only admins can upload exam images
      // Note: We can't check admin role here, so we rely on Firestore rules
      // to prevent non-admins from creating exams with image URLs
      allow write: if isAuthenticated() &&
                     isImageFile() &&
                     isValidSize();
    }
  }
}
```

**Storage Organization:**
- `/avatars/{userId}/{fileName}` - User profile pictures
- `/exam-images/{examId}/{fileName}` - Images used in exam questions

**File Validation:**
- Only image files allowed (image/*)
- Maximum file size: 5MB
- File names should be sanitized before upload


## Code Architecture Changes

### Directory Structure

```
src/
├── integrations/
│   ├── firebase/
│   │   ├── client.ts           # Firebase initialization
│   │   ├── types.ts            # TypeScript interfaces
│   │   └── config.ts           # Firebase config
│   └── supabase/               # Keep for migration period
│       ├── client.ts
│       └── types.ts
├── lib/
│   ├── firebase-auth.ts        # Authentication service
│   ├── firebase-exams.ts       # Exam CRUD operations
│   ├── firebase-attempts.ts    # Attempt management
│   ├── firebase-storage.ts     # File upload/download
│   └── firebase-utils.ts       # Helper functions
├── contexts/
│   └── AuthContext.tsx         # Updated for Firebase
├── hooks/
│   ├── useFirebaseAuth.ts      # Auth hook
│   ├── useExams.ts             # Exam data hook
│   └── useAttempts.ts          # Attempt data hook
└── pages/
    └── [existing pages]        # Updated to use Firebase services
```

### Migration Strategy for Code

**Phase 1: Add Firebase alongside Supabase**
- Install Firebase SDK
- Create Firebase service layer
- Keep Supabase code intact
- No UI changes yet

**Phase 2: Create abstraction layer**
- Create interface for database operations
- Implement Firebase version
- Keep Supabase as fallback

**Phase 3: Switch components one by one**
- Update AuthContext to use Firebase
- Update exam pages to use Firebase
- Update student pages to use Firebase
- Test each component thoroughly

**Phase 4: Remove Supabase**
- Remove Supabase dependencies
- Clean up old code
- Update environment variables


## Context and Hook Updates

### Updated AuthContext

```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/integrations/firebase/client';
import { getUserProfile, AppRole, UserProfile } from '@/lib/firebase-auth';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: AppRole | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!user) return;
    const userProfile = await getUserProfile(user.uid);
    setProfile(userProfile);
    setRole(userProfile?.role || null);
  };

  useEffect(() => {
    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userProfile = await getUserProfile(currentUser.uid);
        setProfile(userProfile);
        setRole(userProfile?.role || null);
      } else {
        setProfile(null);
        setRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, role, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Key Changes:**
- Use `onAuthStateChanged` instead of `supabase.auth.onAuthStateChange`
- Simpler state management (no separate session state)
- Profile fetched directly from Firestore
- Role embedded in profile document


### Custom Hooks for Data Fetching

```typescript
// src/hooks/useExams.ts
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { Exam } from '@/lib/firebase-exams';

export function useExams(userId?: string, publishedOnly: boolean = false) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let q = query(collection(db, 'exams'));

    if (userId) {
      q = query(q, where('createdBy', '==', userId));
    }

    if (publishedOnly) {
      q = query(q, where('isPublished', '==', true));
    }

    q = query(q, orderBy('createdAt', 'desc'));

    // Real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const examData = snapshot.docs.map(doc => ({
          examId: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
          startTime: doc.data().startTime?.toDate() || null,
          endTime: doc.data().endTime?.toDate() || null,
        })) as Exam[];
        
        setExams(examData);
        setLoading(false);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, publishedOnly]);

  return { exams, loading, error };
}
```

```typescript
// src/hooks/useAttempts.ts
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { ExamAttempt } from '@/lib/firebase-attempts';

export function useStudentAttempts(studentId: string, examId?: string) {
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(
      collection(db, 'examAttempts'),
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );

    if (examId) {
      q = query(q, where('examId', '==', examId));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const attemptData = snapshot.docs.map(doc => ({
        attemptId: doc.id,
        ...doc.data(),
        startedAt: doc.data().startedAt.toDate(),
        submittedAt: doc.data().submittedAt?.toDate() || null,
        createdAt: doc.data().createdAt.toDate(),
      })) as ExamAttempt[];
      
      setAttempts(attemptData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [studentId, examId]);

  return { attempts, loading };
}
```

**Benefits of Real-time Listeners:**
- Automatic UI updates when data changes
- No manual polling needed
- Better user experience
- Efficient with Firestore's change detection


## Error Handling

### Firebase Error Codes and Responses

**Authentication Errors:**

| Error Code | Condition | Response |
|------------|-----------|----------|
| `auth/email-already-in-use` | Email already registered | Show "Email already registered. Please login." |
| `auth/invalid-email` | Invalid email format | Show "Please enter a valid email address." |
| `auth/weak-password` | Password < 6 characters | Show "Password must be at least 6 characters." |
| `auth/user-not-found` | User doesn't exist | Show "No account found with this email." |
| `auth/wrong-password` | Incorrect password | Show "Incorrect password. Please try again." |
| `auth/too-many-requests` | Rate limit exceeded | Show "Too many attempts. Please try again later." |
| `auth/network-request-failed` | Network error | Show "Network error. Check your connection." |

**Firestore Errors:**

| Error Code | Condition | Response |
|------------|-----------|----------|
| `permission-denied` | Security rules violation | Show "You don't have permission for this action." |
| `not-found` | Document doesn't exist | Show "Resource not found." |
| `already-exists` | Document already exists | Show "This item already exists." |
| `failed-precondition` | Precondition failed | Show "Operation cannot be completed." |
| `unavailable` | Service unavailable | Show "Service temporarily unavailable. Retry." |

**Storage Errors:**

| Error Code | Condition | Response |
|------------|-----------|----------|
| `storage/unauthorized` | No permission | Show "You don't have permission to upload files." |
| `storage/canceled` | Upload canceled | Show "Upload canceled." |
| `storage/unknown` | Unknown error | Show "Upload failed. Please try again." |


### Error Handling Implementation

```typescript
// src/lib/firebase-utils.ts

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
```


## Testing Strategy

### Unit Testing Approach

**Test Firebase Service Functions:**

```typescript
// src/lib/__tests__/firebase-auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signUp, signIn, getUserProfile } from '../firebase-auth';
import { auth, db } from '@/integrations/firebase/client';

// Mock Firebase
vi.mock('@/integrations/firebase/client', () => ({
  auth: {
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
  },
  db: {
    collection: vi.fn(),
    doc: vi.fn(),
    setDoc: vi.fn(),
    getDoc: vi.fn(),
  }
}));

describe('firebase-auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create user and profile on signup', async () => {
    const mockUser = { uid: 'test-uid', email: 'test@example.com' };
    vi.mocked(auth.createUserWithEmailAndPassword).mockResolvedValue({
      user: mockUser
    } as any);

    const result = await signUp('test@example.com', 'password123', 'Test User', 'student');
    
    expect(result.user.uid).toBe('test-uid');
    expect(db.setDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'student'
      })
    );
  });

  it('should handle email-already-in-use error', async () => {
    vi.mocked(auth.createUserWithEmailAndPassword).mockRejectedValue({
      code: 'auth/email-already-in-use'
    });

    await expect(signUp('test@example.com', 'password123', 'Test User', 'student'))
      .rejects.toThrow();
  });
});
```

**Test Components with Firebase:**

```typescript
// src/components/__tests__/AuthForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from '../auth/AuthForm';
import { signIn } from '@/lib/firebase-auth';

vi.mock('@/lib/firebase-auth');

describe('AuthForm', () => {
  it('should call signIn with correct credentials', async () => {
    vi.mocked(signIn).mockResolvedValue({ user: { uid: 'test' } } as any);
    
    render(<AuthForm />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
```


### Integration Testing Approach

**Test Real Firebase Operations (Emulator):**

```typescript
// vitest.config.ts - Add emulator configuration
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/firebase-emulator-setup.ts'],
  },
});
```

```typescript
// src/test/firebase-emulator-setup.ts
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectStorageEmulator } from 'firebase/storage';
import { auth, db, storage } from '@/integrations/firebase/client';

// Connect to Firebase emulators
if (process.env.NODE_ENV === 'test') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}
```

```typescript
// src/lib/__tests__/firebase-integration.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { signUp, signIn, getUserProfile } from '../firebase-auth';
import { createExam, getExam } from '../firebase-exams';

describe('Firebase Integration Tests', () => {
  let userId: string;
  
  beforeEach(async () => {
    // Create test user
    const result = await signUp(
      'admin@test.com',
      'password123',
      'Test Admin',
      'admin'
    );
    userId = result.user.uid;
  });

  it('should create exam and retrieve it', async () => {
    const examId = await createExam({
      title: 'Test Exam',
      description: 'Test Description',
      createdBy: userId,
      durationMinutes: 60,
      maxAttempts: 3,
      isPublished: true,
      resultsPublished: false,
      shuffleQuestions: false,
      shuffleOptions: false,
      startTime: null,
      endTime: null,
      questionCount: 0,
      totalMarks: 0
    });

    const exam = await getExam(examId);
    
    expect(exam).toBeDefined();
    expect(exam?.title).toBe('Test Exam');
    expect(exam?.createdBy).toBe(userId);
  });
});
```

**Running Tests:**
```bash
# Start Firebase emulators
firebase emulators:start

# Run tests
npm run test
```


## Performance Considerations

### Query Optimization

**1. Use Composite Indexes**

Firestore requires composite indexes for queries with multiple filters or orderBy clauses.

```typescript
// This query requires a composite index
const q = query(
  collection(db, 'examAttempts'),
  where('studentId', '==', studentId),
  where('examId', '==', examId),
  orderBy('createdAt', 'desc')
);
```

**Create indexes via Firebase Console or firestore.indexes.json:**

```json
{
  "indexes": [
    {
      "collectionGroup": "examAttempts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "studentId", "order": "ASCENDING" },
        { "fieldPath": "examId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "examAttempts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "examId", "order": "ASCENDING" },
        { "fieldPath": "isSubmitted", "order": "ASCENDING" },
        { "fieldPath": "submittedAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "exams",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "isPublished", "order": "ASCENDING" },
        { "fieldPath": "startTime", "order": "ASCENDING" }
      ]
    }
  ]
}
```

**2. Denormalization for Read Performance**

Store frequently accessed data together to avoid multiple reads:

```typescript
// Instead of:
// 1. Read attempt
// 2. Read exam for title
// 3. Read user for name

// Do this:
interface ExamAttempt {
  // ... other fields
  examTitle: string;      // Denormalized from exam
  studentName: string;    // Denormalized from user
  studentEmail: string;   // Denormalized from user
}

// Trade-off: Must update attempts when exam title or student name changes
```

**3. Pagination for Large Lists**

```typescript
import { query, collection, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';

async function getExamsPaginated(pageSize: number, lastDoc?: any) {
  let q = query(
    collection(db, 'exams'),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  );
  
  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }
  
  const snapshot = await getDocs(q);
  const exams = snapshot.docs.map(doc => doc.data());
  const lastVisible = snapshot.docs[snapshot.docs.length - 1];
  
  return { exams, lastVisible };
}
```

**4. Offline Persistence**

Enable offline persistence for better performance and offline support:

```typescript
import { enableIndexedDbPersistence } from 'firebase/firestore';

try {
  await enableIndexedDbPersistence(db);
} catch (err) {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open
    console.warn('Persistence failed: multiple tabs open');
  } else if (err.code === 'unimplemented') {
    // Browser doesn't support persistence
    console.warn('Persistence not supported');
  }
}
```

**5. Batch Operations**

Use batch writes for atomic multi-document updates:

```typescript
import { writeBatch } from 'firebase/firestore';

async function updateMultipleDocuments() {
  const batch = writeBatch(db);
  
  // Update up to 500 documents in one batch
  batch.update(doc1Ref, { field: 'value' });
  batch.update(doc2Ref, { field: 'value' });
  batch.delete(doc3Ref);
  
  await batch.commit();
}
```


### Cost Optimization

**Firestore Pricing (as of 2024):**
- Document reads: $0.06 per 100K
- Document writes: $0.18 per 100K
- Document deletes: $0.02 per 100K
- Storage: $0.18 per GB/month

**Optimization Strategies:**

1. **Minimize Security Rule get() Calls**
   - Each `get()` in security rules counts as a read
   - Cache role in user document instead of separate collection
   - Use custom claims for frequently checked permissions

2. **Use Real-time Listeners Wisely**
   - Listeners charge for initial query + changes
   - Unsubscribe when component unmounts
   - Don't use listeners for one-time reads

3. **Batch Reads When Possible**
   - Use `getAll()` for multiple documents
   - Better than individual `getDoc()` calls

4. **Limit Query Results**
   - Always use `limit()` for lists
   - Implement pagination
   - Don't fetch all documents at once

**Estimated Monthly Costs (1000 active users):**
- Authentication: Free (50K MAU included)
- Firestore reads: ~$3-5 (assuming 50K-80K reads)
- Firestore writes: ~$2-3 (assuming 10K-15K writes)
- Storage: ~$1 (assuming 5GB)
- Total: ~$6-9/month


## Security Considerations

### Authentication Security

**1. Password Requirements**
- Minimum 6 characters (Firebase default)
- Recommend 8+ characters with complexity
- Implement client-side validation

```typescript
export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
}
```

**2. Email Verification**
- Enable email verification in Firebase Console
- Require verified email for sensitive operations

```typescript
import { sendEmailVerification } from 'firebase/auth';

async function requireEmailVerification(user: User) {
  if (!user.emailVerified) {
    await sendEmailVerification(user);
    throw new Error('Please verify your email before continuing');
  }
}
```

**3. Session Management**
- Firebase handles session tokens automatically
- Tokens refresh every hour
- Implement logout on all devices if needed

```typescript
import { signOut } from 'firebase/auth';

async function logoutAllDevices() {
  // Firebase doesn't support this directly
  // Workaround: Change password to invalidate all sessions
  await updatePassword(auth.currentUser!, newPassword);
  await signOut(auth);
}
```

### Data Security

**1. Input Validation**
- Validate all user inputs before Firestore writes
- Sanitize HTML content in questions
- Validate file uploads (type, size)

```typescript
export function sanitizeExamInput(exam: Partial<Exam>): Partial<Exam> {
  return {
    ...exam,
    title: exam.title?.trim().substring(0, 200),
    description: exam.description?.trim().substring(0, 1000),
    durationMinutes: Math.max(1, Math.min(exam.durationMinutes || 60, 480)),
    maxAttempts: Math.max(1, Math.min(exam.maxAttempts || 3, 10)),
  };
}
```

**2. XSS Prevention**
- Use React's built-in XSS protection
- Sanitize user-generated content
- Use DOMPurify for rich text

```typescript
import DOMPurify from 'dompurify';

function renderQuestionText(text: string) {
  const clean = DOMPurify.sanitize(text);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

**3. Rate Limiting**
- Implement client-side rate limiting
- Use Firebase App Check for abuse prevention
- Monitor for suspicious activity

```typescript
// Simple client-side rate limiter
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  canAttempt(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }
}
```

**4. Audit Logging**
- Log sensitive operations (exam creation, student blocking)
- Store logs in separate collection
- Implement log retention policy

```typescript
interface AuditLog {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: Timestamp;
  metadata?: Record<string, any>;
}

async function logAction(log: AuditLog) {
  await addDoc(collection(db, 'auditLogs'), log);
}
```


## Migration Strategy

### Phase 1: Preparation (Week 1)

**Goals:**
- Set up Firebase project
- Install dependencies
- Create Firebase service layer
- No changes to existing functionality

**Tasks:**

1. **Create Firebase Project**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools
   
   # Login and initialize
   firebase login
   firebase init
   ```

2. **Install Firebase SDK**
   ```bash
   npm install firebase
   ```

3. **Create Firebase Configuration**
   ```typescript
   // src/integrations/firebase/config.ts
   export const firebaseConfig = {
     apiKey: "AIzaSyA5UNpm_8VghlXdPuvo0UhETORUKitJmo4",
     authDomain: "online-exam-f443c.firebaseapp.com",
     projectId: "online-exam-f443c",
     storageBucket: "online-exam-f443c.firebasestorage.app",
     messagingSenderId: "644701231968",
     appId: "1:644701231968:web:b0fda80164111cbd11dc05"
   };
   ```

4. **Create Service Layer**
   - Implement `firebase/client.ts`
   - Implement `firebase-auth.ts`
   - Implement `firebase-exams.ts`
   - Implement `firebase-attempts.ts`
   - Implement `firebase-storage.ts`

5. **Set Up Security Rules**
   - Deploy Firestore rules
   - Deploy Storage rules
   - Test rules in Firebase Console

6. **Create Indexes**
   - Deploy `firestore.indexes.json`
   - Wait for index creation (can take hours)

**Validation:**
- All Firebase services initialized
- Security rules deployed
- Indexes created
- No impact on production

