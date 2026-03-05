# Google Sign-In - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Enable Google Authentication in Firebase (2 minutes)

1. Go to https://console.firebase.google.com/
2. Select project: `online-exam-f443c`
3. Click **Authentication** in left menu
4. Click **Sign-in method** tab
5. Find **Google** in the list
6. Click **Google** → Toggle **Enable**
7. Enter support email: `isak@gmail.com`
8. Click **Save**

✅ Done! Google Sign-In is now enabled.

---

### Step 2: Test It (3 minutes)

1. Run your app locally or visit your deployed site
2. Go to the login/signup page
3. You should see a new button: **"Continue with Google"**
4. Click it and sign in with any Google account
5. If it's a new account, select a department
6. You'll be redirected to the dashboard

✅ Done! Google Sign-In is working.

---

## 🎯 What Users See

### Login Page:
- Email/Password fields (existing)
- **NEW:** "Continue with Google" button with Google logo

### First-Time Google Users:
- Click "Continue with Google"
- Select Google account
- **NEW:** Profile setup page appears
- Edit your full name if needed (pre-filled from Google)
- Select department
- Click "Complete Setup"
- Redirected to dashboard

### Returning Google Users:
- Click "Continue with Google"
- Select Google account
- Immediately redirected to dashboard (no setup needed)

---

## 🔧 Configuration Details

### Firebase Console Settings:
- **Provider:** Google
- **Status:** Enabled
- **Support Email:** isak@gmail.com
- **Authorized Domains:** 
  - localhost (auto)
  - exampro.vercel.app (auto)
  - Your custom domains (add manually if needed)

### User Profile Created:
```javascript
{
  userId: "google-uid",
  email: "user@gmail.com",
  fullName: "User Name",
  role: "student",
  departmentId: "selected-dept-id",
  avatarUrl: null,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🐛 Quick Troubleshooting

### Button doesn't appear?
- Clear browser cache
- Check that files were saved correctly
- Restart development server

### "Popup blocked" error?
- Disable popup blocker for your domain
- Try in incognito mode

### "Unauthorized domain" error?
- Add your domain in Firebase Console
- Go to Authentication → Settings → Authorized domains

### Profile setup doesn't show departments?
- Check Firestore has departments collection
- Verify Firestore rules allow reading departments

---

## 📱 Mobile Testing

Works perfectly on mobile! Test on:
- iOS Safari
- Android Chrome
- Mobile browsers

The Google popup adapts automatically to mobile screens.

---

## ✅ Production Deployment

Before going live:
1. ✅ Enable Google in Firebase Console (done above)
2. ✅ Test on production URL
3. ✅ Verify authorized domains include production domain
4. ✅ Update privacy policy to mention Google sign-in
5. ✅ Monitor Firebase logs for any issues

---

## 🎉 You're Done!

Google Sign-In is now live in your ExamPro app!

**Benefits:**
- ✅ Faster sign-up (no password needed)
- ✅ Better security (Google handles authentication)
- ✅ Reduced password reset requests
- ✅ Professional appearance
- ✅ Mobile-friendly

**Need more details?** See `GOOGLE_SIGNIN_SETUP.md` for complete documentation.

---

**Questions?** Check Firebase Console logs or browser console for errors.
