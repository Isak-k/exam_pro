@echo off
echo Deploying Firestore Rules...
firebase deploy --only firestore:rules
echo.
echo Done! Please refresh your browser.
pause
