# Vercel Environment Variables Setup

## Important: Add Environment Variables to Vercel

Your app needs environment variables to work in production. Follow these steps:

### Step 1: Go to Vercel Project Settings
1. Go to https://vercel.com/dashboard
2. Click on your project (exam_pro)
3. Click "Settings" tab
4. Click "Environment Variables" in the left sidebar

### Step 2: Add All Environment Variables

Add each of these variables:

#### Firebase Configuration
```
VITE_FIREBASE_API_KEY=AIzaSyA5UNpm_8VghlXdPuvo0UhETORUKitJmo4
VITE_FIREBASE_AUTH_DOMAIN=online-exam-f443c.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=online-exam-f443c
VITE_FIREBASE_STORAGE_BUCKET=online-exam-f443c.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=644701231968
VITE_FIREBASE_APP_ID=1:644701231968:web:b0fda80164111cbd11dc05
```

#### Google AI API Key
```
VITE_GOOGLE_AI_API_KEY=AIzaSyCA75QWEPkYtGOAQgwYtM7cZA3dS5TzyPE
```

### Step 3: Set Environment for Each Variable
For each variable, select:
- ✅ Production
- ✅ Preview
- ✅ Development

### Step 4: Redeploy
After adding all variables:
1. Go to "Deployments" tab
2. Click the three dots (...) on the latest deployment
3. Click "Redeploy"

## Why This Is Needed

Your `.env` file is not pushed to GitHub (protected by .gitignore), so Vercel doesn't have access to these values. You must add them manually in Vercel's dashboard.

## Security Note

These environment variables are safe to expose in the browser because:
- Firebase API keys are meant to be public (protected by Firebase Security Rules)
- Google AI API key is for client-side use
- Actual security is enforced by Firebase Authentication and Firestore Rules
