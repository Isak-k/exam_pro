# Requirements Document

## Introduction

This document specifies the requirements for converting the existing React + TypeScript + Supabase web-based exam management system into a native mobile application that operates 100% offline. The mobile app will support both iOS and Android platforms, replacing cloud-based Supabase storage with local database storage while maintaining all existing features including role-based access, exam creation, exam taking, results viewing, and analytics.

## Glossary

- **Mobile_App**: The cross-platform native mobile application built with React Native or similar framework
- **Local_Database**: The on-device database system (SQLite, Realm, or WatermelonDB) that stores all application data
- **Sync_Engine**: The component responsible for synchronizing local data with remote servers when connectivity is available
- **Auth_Manager**: The local authentication system that manages user sessions without server dependency
- **Storage_Manager**: The component that manages local file storage for images and media
- **Admin**: A user with administrative privileges who can create and manage exams
- **Student**: A user who can take exams and view their results
- **Exam**: A collection of questions with associated metadata (title, duration, settings)
- **Question**: An individual exam question with multiple choice options
- **Attempt**: A single instance of a student taking an exam
- **Result**: The outcome of a completed exam attempt including score and answers
- **Conflict_Resolver**: The component that handles data conflicts during synchronization
- **Encryption_Service**: The service that encrypts sensitive data stored locally on the device
- **Gamification_Engine**: The component that manages badges, achievements, points, and leaderboards
- **Achievement_System**: The subsystem that tracks and awards student accomplishments
- **Badge**: A visual award given to students for specific achievements
- **Leaderboard**: A ranked display of students based on performance metrics
- **Points**: Numerical rewards awarded for various student activities
- **Time_Extension_Manager**: The component that manages and applies time extensions for individual students
- **Extension**: Additional time granted to a student for a specific exam
- **Audit_Logger**: The component that records all significant user actions and system events
- **Audit_Log**: A timestamped record of a user action or system event
- **Audit_Entry**: A single record in the audit log containing timestamp, user, action, and metadata

## Requirements

### Requirement 1: Cross-Platform Mobile Application

**User Story:** As a user, I want to use the exam management system on both iOS and Android devices, so that I can access the application regardless of my mobile platform.

#### Acceptance Criteria

1. THE Mobile_App SHALL run natively on iOS devices running iOS 13.0 or later
2. THE Mobile_App SHALL run natively on Android devices running Android 8.0 (API level 26) or later
3. THE Mobile_App SHALL provide identical functionality on both iOS and Android platforms
4. THE Mobile_App SHALL use platform-specific UI components where appropriate for native look and feel
5. THE Mobile_App SHALL support both portrait and landscape orientations on tablets

### Requirement 2: Local Database Storage

**User Story:** As a developer, I want all application data stored in a local database, so that the app can function without internet connectivity.

#### Acceptance Criteria

1. THE Local_Database SHALL store all user profiles, roles, exams, questions, attempts, answers, and blocked student records
2. THE Local_Database SHALL persist data across app restarts and device reboots
3. THE Local_Database SHALL support relational data with foreign key constraints matching the existing schema
4. THE Local_Database SHALL support JSONB or equivalent for storing question options
5. THE Local_Database SHALL provide transaction support for atomic operations
6. WHEN the app is first installed, THE Local_Database SHALL initialize with the required schema
7. THE Local_Database SHALL support database migrations for schema updates

### Requirement 3: Offline Authentication

**User Story:** As a user, I want to log in and use the app without internet connection, so that I can access my exams anytime.

#### Acceptance Criteria

1. THE Auth_Manager SHALL authenticate users using locally stored credentials
2. THE Auth_Manager SHALL securely hash and store user passwords using bcrypt or equivalent
3. WHEN a user logs in successfully, THE Auth_Manager SHALL create a local session token
4. THE Auth_Manager SHALL maintain session state across app restarts
5. THE Auth_Manager SHALL support role-based access control (admin/student) using locally stored roles
6. WHEN a user logs out, THE Auth_Manager SHALL clear the local session token
7. THE Auth_Manager SHALL support biometric authentication (fingerprint/face recognition) where available

### Requirement 4: Offline Exam Creation and Management

**User Story:** As an admin, I want to create and edit exams while offline, so that I can prepare exams without requiring internet access.

#### Acceptance Criteria

1. WHEN an admin creates an exam, THE Mobile_App SHALL store the exam in the Local_Database
2. THE Mobile_App SHALL allow admins to add, edit, and delete questions for any exam
3. THE Mobile_App SHALL support all existing exam settings (duration, start/end time, max attempts, shuffle options, publish status)
4. THE Mobile_App SHALL allow admins to upload and attach images to questions using the device camera or gallery
5. THE Mobile_App SHALL validate exam data before saving to the Local_Database
6. THE Mobile_App SHALL allow admins to duplicate existing exams
7. THE Mobile_App SHALL allow admins to preview exams before publishing

### Requirement 5: Offline Exam Taking

**User Story:** As a student, I want to take exams while offline, so that I can complete exams without internet connectivity.

#### Acceptance Criteria

1. WHEN a student starts an exam, THE Mobile_App SHALL create an attempt record in the Local_Database
2. THE Mobile_App SHALL display questions according to the exam's shuffle settings
3. THE Mobile_App SHALL enforce the exam duration timer locally
4. WHEN a student selects an answer, THE Mobile_App SHALL save the answer to the Local_Database immediately
5. THE Mobile_App SHALL track time spent on each question
6. WHEN the timer expires, THE Mobile_App SHALL automatically submit the exam
7. THE Mobile_App SHALL prevent students from taking exams they are blocked from
8. THE Mobile_App SHALL enforce maximum attempt limits locally
9. THE Mobile_App SHALL display instant feedback when feedback_type is set to 'instant'

### Requirement 6: Local File Storage

**User Story:** As an admin, I want to attach images to exam questions, so that I can create visually rich questions that work offline.

#### Acceptance Criteria

1. THE Storage_Manager SHALL store uploaded images in the device's local file system
2. THE Storage_Manager SHALL generate unique identifiers for each stored file
3. THE Storage_Manager SHALL maintain references between questions and their associated image files
4. THE Storage_Manager SHALL compress images to optimize storage space while maintaining readability
5. WHEN an image is deleted from a question, THE Storage_Manager SHALL remove the orphaned file
6. THE Storage_Manager SHALL support common image formats (JPEG, PNG, WebP)
7. THE Storage_Manager SHALL provide file size limits (maximum 5MB per image)

### Requirement 7: Offline Results and Analytics

**User Story:** As a user, I want to view exam results and analytics while offline, so that I can review performance without internet access.

#### Acceptance Criteria

1. WHEN a student submits an exam, THE Mobile_App SHALL calculate the score locally
2. THE Mobile_App SHALL store the calculated score in the Local_Database
3. THE Mobile_App SHALL display results to students only when results_published is true
4. THE Mobile_App SHALL show admins all student attempts and scores for any exam
5. THE Mobile_App SHALL calculate and display analytics (average scores, pass rates, question difficulty) using local data
6. THE Mobile_App SHALL generate charts and graphs for analytics visualization
7. THE Mobile_App SHALL allow admins to export results as PDF or CSV files

### Requirement 8: Data Synchronization

**User Story:** As a user, I want my data to sync with other devices when internet is available, so that I can access my exams and results across multiple devices.

#### Acceptance Criteria

1. WHEN internet connectivity is detected, THE Sync_Engine SHALL automatically initiate synchronization
2. THE Sync_Engine SHALL upload locally created or modified records to the remote server
3. THE Sync_Engine SHALL download new or updated records from the remote server
4. THE Sync_Engine SHALL track the last sync timestamp for each data entity
5. THE Sync_Engine SHALL use incremental sync to transfer only changed data
6. THE Sync_Engine SHALL display sync progress to the user
7. WHEN sync fails, THE Sync_Engine SHALL retry with exponential backoff
8. THE Sync_Engine SHALL allow users to manually trigger synchronization
9. THE Sync_Engine SHALL sync in the background when the app is in the foreground

### Requirement 9: Conflict Resolution

**User Story:** As a user, I want data conflicts to be resolved automatically when syncing, so that I don't lose data when using multiple devices.

#### Acceptance Criteria

1. WHEN the same record is modified on multiple devices, THE Conflict_Resolver SHALL detect the conflict
2. THE Conflict_Resolver SHALL use last-write-wins strategy for profile and settings updates
3. THE Conflict_Resolver SHALL preserve all exam attempts and answers without merging (append-only)
4. WHEN an admin modifies an exam on multiple devices, THE Conflict_Resolver SHALL use the most recent timestamp
5. THE Conflict_Resolver SHALL log all conflicts for admin review
6. THE Conflict_Resolver SHALL notify users when conflicts are resolved
7. WHEN a conflict cannot be auto-resolved, THE Conflict_Resolver SHALL prompt the user to choose a version

### Requirement 10: Data Security

**User Story:** As a user, I want my exam data to be encrypted on my device, so that my information remains secure if my device is lost or stolen.

#### Acceptance Criteria

1. THE Encryption_Service SHALL encrypt the Local_Database using AES-256 encryption
2. THE Encryption_Service SHALL derive encryption keys from user credentials
3. THE Encryption_Service SHALL encrypt stored image files
4. THE Encryption_Service SHALL use secure key storage (iOS Keychain, Android Keystore)
5. WHEN a user logs out, THE Encryption_Service SHALL ensure data remains encrypted
6. THE Encryption_Service SHALL encrypt data in transit during synchronization using TLS 1.3
7. THE Encryption_Service SHALL securely wipe sensitive data from memory after use

### Requirement 11: Storage Management

**User Story:** As a user, I want the app to manage storage efficiently, so that it doesn't consume excessive device storage.

#### Acceptance Criteria

1. THE Mobile_App SHALL display current storage usage in the settings screen
2. THE Mobile_App SHALL allow users to clear cached data
3. THE Mobile_App SHALL allow students to delete old exam attempts to free space
4. THE Mobile_App SHALL warn users when storage usage exceeds 80% of available space
5. THE Mobile_App SHALL automatically compress old data that hasn't been accessed in 90 days
6. THE Mobile_App SHALL provide an option to export and archive old exams
7. WHEN storage is critically low, THE Mobile_App SHALL prevent new exam creation until space is freed

### Requirement 12: Data Export and Import

**User Story:** As an admin, I want to export and import exam data, so that I can transfer exams between devices or backup my data.

#### Acceptance Criteria

1. THE Mobile_App SHALL allow admins to export individual exams as encrypted JSON files
2. THE Mobile_App SHALL allow admins to export all exams and results as a single archive
3. THE Mobile_App SHALL include associated images in exported archives
4. THE Mobile_App SHALL allow admins to import exams from exported files
5. WHEN importing, THE Mobile_App SHALL validate the file format and data integrity
6. THE Mobile_App SHALL allow users to share exported files via email, cloud storage, or direct transfer
7. THE Mobile_App SHALL support importing exams created on different devices

### Requirement 13: Offline Student Management

**User Story:** As an admin, I want to manage student accounts and permissions offline, so that I can control access without internet connectivity.

#### Acceptance Criteria

1. THE Mobile_App SHALL allow admins to create new student accounts locally
2. THE Mobile_App SHALL allow admins to block students from specific exams
3. THE Mobile_App SHALL allow admins to view all student profiles and their exam history
4. THE Mobile_App SHALL allow admins to reset student passwords
5. THE Mobile_App SHALL allow admins to delete student accounts and associated data
6. WHEN a student is blocked from an exam, THE Mobile_App SHALL prevent them from starting new attempts immediately
7. THE Mobile_App SHALL allow admins to assign temporary passwords for new students

### Requirement 14: Performance Optimization

**User Story:** As a user, I want the app to perform smoothly, so that I have a responsive experience even with large amounts of data.

#### Acceptance Criteria

1. THE Mobile_App SHALL load the exam list in less than 500ms for up to 100 exams
2. THE Mobile_App SHALL render questions with images in less than 200ms
3. THE Mobile_App SHALL save student answers to the Local_Database in less than 100ms
4. THE Mobile_App SHALL use pagination for lists with more than 50 items
5. THE Mobile_App SHALL lazy-load images to reduce memory usage
6. THE Mobile_App SHALL use database indexes on frequently queried fields (exam_id, student_id, created_at)
7. THE Mobile_App SHALL maintain 60 FPS scrolling performance on lists and exam screens

### Requirement 15: Network Detection and Connectivity

**User Story:** As a user, I want to see my connection status, so that I know when data will sync.

#### Acceptance Criteria

1. THE Mobile_App SHALL detect and display the current network connectivity status
2. THE Mobile_App SHALL distinguish between WiFi, cellular, and offline states
3. WHEN connectivity changes, THE Mobile_App SHALL update the status indicator within 2 seconds
4. THE Mobile_App SHALL allow users to configure sync preferences (WiFi only, WiFi + cellular, manual only)
5. WHEN offline, THE Mobile_App SHALL display a clear indicator that the app is in offline mode
6. THE Mobile_App SHALL queue sync operations when offline and execute them when connectivity returns
7. THE Mobile_App SHALL estimate data usage for pending sync operations

### Requirement 16: Migration from Web to Mobile

**User Story:** As an existing user, I want to migrate my data from the web app to the mobile app, so that I can continue using my existing exams and results.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a one-time data import feature for existing users
2. THE Mobile_App SHALL connect to the existing Supabase backend to download user data
3. THE Mobile_App SHALL import all exams, questions, attempts, and results from the web app
4. THE Mobile_App SHALL download and store all associated images locally
5. WHEN migration is complete, THE Mobile_App SHALL verify data integrity
6. THE Mobile_App SHALL display migration progress with percentage completion
7. IF migration fails, THE Mobile_App SHALL allow users to retry or skip specific items

### Requirement 17: Exam Timer and Notifications

**User Story:** As a student, I want to receive notifications about exam time remaining, so that I can manage my time effectively.

#### Acceptance Criteria

1. WHEN an exam is in progress, THE Mobile_App SHALL display a countdown timer
2. THE Mobile_App SHALL send a local notification when 5 minutes remain in an exam
3. THE Mobile_App SHALL send a local notification when 1 minute remains in an exam
4. THE Mobile_App SHALL allow students to minimize the app without pausing the timer
5. WHEN the app is backgrounded during an exam, THE Mobile_App SHALL continue the timer
6. WHEN the timer expires, THE Mobile_App SHALL automatically submit the exam even if the app is backgrounded
7. THE Mobile_App SHALL request notification permissions on first launch

### Requirement 18: Question Media Support

**User Story:** As an admin, I want to add images to questions, so that I can create comprehensive visual questions.

#### Acceptance Criteria

1. THE Mobile_App SHALL allow admins to attach one image per question
2. THE Mobile_App SHALL support capturing images directly from the device camera
3. THE Mobile_App SHALL support selecting images from the device photo gallery
4. THE Mobile_App SHALL display image previews in the question editor
5. THE Mobile_App SHALL allow admins to crop and rotate images before attaching
6. THE Mobile_App SHALL display images in questions during exam taking
7. THE Mobile_App SHALL support pinch-to-zoom on question images during exams

### Requirement 19: Offline Analytics Dashboard

**User Story:** As an admin, I want to view comprehensive analytics offline, so that I can analyze exam performance without internet access.

#### Acceptance Criteria

1. THE Mobile_App SHALL display overall statistics (total exams, total students, total attempts)
2. THE Mobile_App SHALL display per-exam statistics (average score, completion rate, time spent)
3. THE Mobile_App SHALL display per-question statistics (correct rate, average time spent)
4. THE Mobile_App SHALL display per-student statistics (exams taken, average score, total time)
5. THE Mobile_App SHALL generate bar charts for score distribution
6. THE Mobile_App SHALL generate line charts for performance trends over time
7. THE Mobile_App SHALL allow admins to filter analytics by date range

### Requirement 20: App Settings and Configuration

**User Story:** As a user, I want to configure app settings, so that I can customize the app behavior to my preferences.

#### Acceptance Criteria

1. THE Mobile_App SHALL provide a settings screen accessible from the main menu
2. THE Mobile_App SHALL allow users to toggle dark mode and light mode
3. THE Mobile_App SHALL allow users to configure sync preferences
4. THE Mobile_App SHALL allow users to enable or disable biometric authentication
5. THE Mobile_App SHALL allow users to view app version and storage usage
6. THE Mobile_App SHALL allow users to clear local cache
7. THE Mobile_App SHALL allow admins to configure default exam settings (duration, attempts, shuffle)
8. THE Mobile_App SHALL persist all settings in the Local_Database


### Requirement 21: Gamification System

**User Story:** As a student, I want to earn badges and points for my achievements, so that I feel motivated and engaged while taking exams.

#### Acceptance Criteria

1. WHEN a student completes their first exam, THE Gamification_Engine SHALL award a "First Steps" badge
2. WHEN a student achieves a perfect score on any exam, THE Gamification_Engine SHALL award a "Perfect Score" badge
3. WHEN a student completes exams on consecutive days, THE Gamification_Engine SHALL track the streak and award streak badges at 3, 7, 14, and 30 days
4. WHEN a student completes an exam, THE Gamification_Engine SHALL award points based on the score (1 point per percentage point)
5. WHEN a student completes an exam faster than the average time, THE Gamification_Engine SHALL award a "Speed Demon" badge
6. THE Achievement_System SHALL store all earned badges and points in the Local_Database
7. THE Mobile_App SHALL display a leaderboard showing top students ranked by total points
8. THE Mobile_App SHALL display a leaderboard showing top students ranked by average score
9. THE Mobile_App SHALL display a leaderboard showing top students ranked by completion rate
10. THE Mobile_App SHALL allow students to view their own badge collection and achievement history
11. THE Mobile_App SHALL display visual progress indicators showing advancement toward next achievements
12. WHEN a student earns a new badge, THE Mobile_App SHALL display a celebration animation
13. THE Gamification_Engine SHALL unlock bonus content or features when students reach point milestones (1000, 5000, 10000 points)
14. THE Mobile_App SHALL allow admins to view all students' gamification statistics
15. THE Gamification_Engine SHALL calculate and update leaderboard rankings within 1 second of exam submission
16. THE Mobile_App SHALL allow students to opt out of leaderboard display while retaining personal badges and points

### Requirement 22: Time Extensions

**User Story:** As an admin, I want to grant individual students extra time for specific exams, so that I can provide accommodations for students who need them.

#### Acceptance Criteria

1. THE Mobile_App SHALL allow admins to grant time extensions to individual students for specific exams
2. THE Time_Extension_Manager SHALL support percentage-based extensions (25%, 50%, 100%, 150%)
3. THE Time_Extension_Manager SHALL support fixed time extensions in minutes (15, 30, 45, 60 minutes)
4. WHEN an admin grants an extension, THE Time_Extension_Manager SHALL store the extension in the Local_Database with exam_id, student_id, extension_type, and extension_value
5. WHEN a student with an extension starts an exam, THE Mobile_App SHALL calculate and apply the extended duration
6. WHEN a student with an extension is taking an exam, THE Mobile_App SHALL display the extended time limit in the timer
7. THE Mobile_App SHALL display a visual indicator on the exam screen when extended time is active
8. THE Mobile_App SHALL allow admins to view all students who have extensions for a specific exam
9. THE Mobile_App SHALL allow admins to view all extensions granted to a specific student
10. THE Mobile_App SHALL allow admins to modify or revoke extensions before the student starts the exam
11. WHEN an extension is revoked after a student has started, THE Mobile_App SHALL not affect the current attempt
12. THE Mobile_App SHALL store extension metadata in exam attempt records for audit purposes
13. THE Mobile_App SHALL allow students to submit accommodation requests with justification text
14. WHEN a student submits an accommodation request, THE Mobile_App SHALL notify admins and store the request in the Local_Database
15. THE Mobile_App SHALL allow admins to approve or deny accommodation requests
16. WHEN an admin approves a request, THE Time_Extension_Manager SHALL automatically create the corresponding extension

### Requirement 23: Audit Logs

**User Story:** As an admin, I want to view detailed audit logs of all system actions, so that I can track activity and investigate security incidents.

#### Acceptance Criteria

1. WHEN an admin creates an exam, THE Audit_Logger SHALL record an audit entry with timestamp, admin_id, action type "exam_created", and exam_id
2. WHEN an admin modifies an exam, THE Audit_Logger SHALL record an audit entry with timestamp, admin_id, action type "exam_modified", exam_id, and changed fields
3. WHEN an admin deletes an exam, THE Audit_Logger SHALL record an audit entry with timestamp, admin_id, action type "exam_deleted", and exam_id
4. WHEN a student submits an exam, THE Audit_Logger SHALL record an audit entry with timestamp, student_id, action type "exam_submitted", exam_id, and attempt_id
5. WHEN a student starts an exam attempt, THE Audit_Logger SHALL record an audit entry with timestamp, student_id, action type "exam_started", and exam_id
6. WHEN an admin modifies a grade, THE Audit_Logger SHALL record an audit entry with timestamp, admin_id, action type "grade_modified", attempt_id, old_score, and new_score
7. WHEN a security violation occurs (blocked student attempting exam, invalid authentication), THE Audit_Logger SHALL record an audit entry with timestamp, user_id, action type "security_violation", and violation details
8. WHEN a user logs in, THE Audit_Logger SHALL record an audit entry with timestamp, user_id, action type "login", and device information
9. WHEN a user logs out, THE Audit_Logger SHALL record an audit entry with timestamp, user_id, and action type "logout"
10. WHEN an admin exports data, THE Audit_Logger SHALL record an audit entry with timestamp, admin_id, action type "data_exported", and export scope
11. WHEN an admin imports data, THE Audit_Logger SHALL record an audit entry with timestamp, admin_id, action type "data_imported", and number of records imported
12. THE Audit_Logger SHALL store all audit entries in the Local_Database with indexed timestamp and user_id fields
13. THE Mobile_App SHALL provide a searchable audit log interface for admins
14. THE Mobile_App SHALL allow admins to filter audit logs by date range, user, action type, and exam
15. THE Mobile_App SHALL allow admins to export audit logs as CSV files
16. THE Audit_Logger SHALL retain all audit logs for a minimum of 365 days
17. WHEN audit logs exceed 365 days, THE Audit_Logger SHALL archive old logs before deletion
18. THE Mobile_App SHALL display audit log entries in reverse chronological order (newest first)
19. THE Mobile_App SHALL paginate audit log display with 50 entries per page
20. THE Audit_Logger SHALL include IP address or device identifier in audit entries where applicable
