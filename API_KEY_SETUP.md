# Google AI API Key Setup

## What Changed

The AI MCQ generation feature now uses a hardcoded API key from your environment configuration instead of asking users to enter it each time.

## Changes Made

### 1. Modified `src/components/exam/BulkImportQuestions.tsx`
- Removed the API key input field
- API key is now loaded from environment variable: `VITE_GOOGLE_AI_API_KEY`
- Users no longer need to enter the API key manually

### 2. Updated `.env` file
- Added `VITE_GOOGLE_AI_API_KEY` variable

## Setup Instructions

### Step 1: Get Your Google AI API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Add API Key to .env File

1. Open the `.env` file in your project root
2. Find the line: `VITE_GOOGLE_AI_API_KEY="YOUR_API_KEY_HERE"`
3. Replace `YOUR_API_KEY_HERE` with your actual API key
4. Example: `VITE_GOOGLE_AI_API_KEY="AIzaSyAbc123..."`

### Step 3: Restart Your Development Server

After updating the .env file, you must restart your dev server:

```bash
# Stop the current server (Ctrl+C)
# Then start it again
npm run dev
```

## How It Works Now

1. Admin goes to Edit Exam → Bulk Import Questions
2. Clicks on "AI Generation" tab
3. Selects number of questions (1-100)
4. Uploads a PDF file
5. Clicks "Generate MCQs from PDF"
6. No API key input required - it uses the one from .env automatically

## Security Notes

- The API key is stored in `.env` file which should NOT be committed to Git
- Make sure `.env` is in your `.gitignore` file
- For production deployment, set the environment variable on your hosting platform:
  - Vercel: Project Settings → Environment Variables
  - Netlify: Site Settings → Build & Deploy → Environment
  - Firebase Hosting: Use `.env.production` file

## Troubleshooting

### "API Key Not Configured" Error

If users see this error, it means:
1. The `.env` file doesn't have the API key
2. The API key variable name is wrong
3. The dev server wasn't restarted after adding the key

**Solution**: 
1. Check `.env` file has: `VITE_GOOGLE_AI_API_KEY="your-key-here"`
2. Restart the dev server

### API Key Not Working

If the API key doesn't work:
1. Verify the key is correct (no extra spaces or quotes)
2. Check the key has the Gemini API enabled in Google Cloud Console
3. Make sure you haven't exceeded the free tier limits

## For Production Deployment

When deploying to production, you need to set the environment variable on your hosting platform:

### Vercel
```bash
vercel env add VITE_GOOGLE_AI_API_KEY
# Paste your API key when prompted
```

### Netlify
1. Go to Site Settings → Build & Deploy → Environment
2. Click "Add variable"
3. Key: `VITE_GOOGLE_AI_API_KEY`
4. Value: Your API key

### Firebase Hosting
Create `.env.production` file:
```
VITE_GOOGLE_AI_API_KEY="your-production-api-key"
```

## Benefits

✅ Users don't need to enter API key every time
✅ Cleaner, more professional UI
✅ Centralized API key management
✅ Easy to update the key without code changes
✅ More secure (key not visible in browser)
