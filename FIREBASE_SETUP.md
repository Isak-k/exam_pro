# Firebase Setup Instructions

## Prerequisites

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

## Deploy Security Rules and Indexes

### Option 1: Deploy Everything
```bash
firebase deploy
```

### Option 2: Deploy Specific Components

Deploy Firestore rules only:
```bash
firebase deploy --only firestore:rules
```

Deploy Firestore indexes only:
```bash
firebase deploy --only firestore:indexes
```

Deploy Storage rules only:
```bash
firebase deploy --only storage
```

## Manual Setup (Alternative)

If you prefer to set up rules manually through the Firebase Console:

### 1. Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `online-exam-f443c`
3. Navigate to **Firestore Database** → **Rules**
4. Copy the contents of `firestore.rules` and paste it
5. Click **Publish**

### 2. Firestore Indexes

1. In Firestore Database, go to **Indexes** tab
2. Firebase will automatically suggest indexes when you run queries
3. Or manually create indexes from `firestore.indexes.json`

### 3. Storage Security Rules

1. Navigate to **Storage** → **Rules**
2. Copy the contents of `storage.rules` and paste it
3. Click **Publish**

## Security Rules Overview

### Firestore Rules

**Users Collection:**
- Anyone authenticated can read user profiles
- Users can only create/update their own profile
- Role cannot be changed after creation

**Exams Collection:**
- Admins can create, read, update, delete their own exams
- Students can only read published exams
- Questions are protected by exam ownership

**Exam Attempts Collection:**
- Students can create and update their own attempts
- Once submitted, attempts become immutable
- Admins can read all attempts

### Storage Rules

**Avatar Images:**
- Users can only upload their own avatar
- Max size: 5MB
- Only image files allowed

**Exam Images:**
- Only authenticated users can upload
- Max size: 5MB
- Only image files allowed

## Testing Rules

You can test your security rules locally using Firebase Emulator:

```bash
firebase emulators:start
```

Then update your Firebase client to connect to emulators in development:

```typescript
// src/integrations/firebase/client.ts
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectStorageEmulator(storage, 'localhost', 9199);
}
```

## Important Notes

1. **Deploy rules BEFORE testing** - Without rules, all operations will fail
2. **Test thoroughly** - Make sure both admin and student roles work correctly
3. **Monitor usage** - Check Firebase Console for any security rule violations
4. **Backup data** - Always backup before making rule changes

## Quick Deploy Command

For first-time setup, run:

```bash
# Initialize Firebase (if not done)
firebase init

# Select:
# - Firestore
# - Storage
# - Use existing project: online-exam-f443c

# Deploy everything
firebase deploy
```

## Troubleshooting

**Error: "Missing or insufficient permissions"**
- Make sure you've deployed the security rules
- Check that the user is authenticated
- Verify the user's role in Firestore

**Error: "PERMISSION_DENIED"**
- Check the security rules match your data structure
- Verify field names are correct (userId, createdBy, etc.)
- Make sure timestamps are set correctly

**Indexes not working**
- Deploy indexes: `firebase deploy --only firestore:indexes`
- Or create them manually when Firebase suggests them
- Wait a few minutes for indexes to build
