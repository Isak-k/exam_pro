# Firebase Quick Start Guide

## 🚀 Deploy Security Rules (REQUIRED)

Your Firebase project needs security rules to work. Choose one method:

### Method 1: Using Firebase Console (Easiest)

1. **Go to Firebase Console:** https://console.firebase.google.com/
2. **Select your project:** `online-exam-f443c`

#### Deploy Firestore Rules:
1. Click **Firestore Database** in left menu
2. Click **Rules** tab
3. Copy ALL content from `firestore.rules` file
4. Paste into the editor
5. Click **Publish**

#### Deploy Storage Rules:
1. Click **Storage** in left menu
2. Click **Rules** tab
3. Copy ALL content from `storage.rules` file
4. Paste into the editor
5. Click **Publish**

### Method 2: Using Firebase CLI (Recommended)

```bash
# Install Firebase CLI (one time only)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore
# - Storage
# - Use existing project: online-exam-f443c
# - Use existing files (firestore.rules, storage.rules, firestore.indexes.json)

# Deploy everything
firebase deploy
```

## 📋 What Each Rule File Does

### `firestore.rules` - Database Security
- Controls who can read/write to your database
- Admins can manage exams
- Students can take exams and view results
- Users can only access their own data

### `storage.rules` - File Upload Security
- Controls who can upload/download files
- Users can upload their own avatars
- Admins can upload exam images
- 5MB file size limit

### `firestore.indexes.json` - Query Optimization
- Makes database queries faster
- Required for complex queries (filtering + sorting)
- Automatically created when needed

## ✅ Verify Rules Are Deployed

After deploying, test your app:

1. Go to http://localhost:8082/firebase-test
2. Create a new account
3. Sign in
4. If it works, rules are deployed correctly!

## ❌ Common Errors

**"Missing or insufficient permissions"**
→ Rules not deployed yet. Follow steps above.

**"PERMISSION_DENIED: Missing or insufficient permissions"**
→ Check that you're signed in and have the correct role.

**"Loading..." forever**
→ User profile not found. Create a new account in Firebase.

## 🔑 Important Notes

1. **Firebase ≠ Supabase** - They are separate systems
2. **Old accounts won't work** - Create new accounts in Firebase
3. **Deploy rules first** - App won't work without them
4. **Test with new account** - Use /firebase-test page

## 📞 Need Help?

Check the Firebase Console for detailed error messages:
- Firestore: https://console.firebase.google.com/project/online-exam-f443c/firestore
- Storage: https://console.firebase.google.com/project/online-exam-f443c/storage
- Authentication: https://console.firebase.google.com/project/online-exam-f443c/authentication
