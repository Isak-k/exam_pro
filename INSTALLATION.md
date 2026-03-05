# 📱 Mobile Installation Guide

ExamPro supports two ways to install on mobile devices:

1.  **PWA (Progressive Web App)** - Instant installation from the browser.
2.  **Native App** - Build for Android/iOS using Capacitor.

## 1. PWA Installation (Recommended)

The app is now configured as a PWA. When you visit the site on a mobile device, you will see an **Install** prompt at the bottom of the screen.

### Features
- Works offline
- Full-screen experience (no browser bar)
- Home screen icon
- Fast loading

### How to Install
- **Android (Chrome)**: Tap the "Install" button in the prompt, or open the menu (⋮) and select "Install App".
- **iOS (Safari)**: Tap the Share button (square with arrow) and select "Add to Home Screen".

## 2. Native App (Android/iOS)

This project uses **Capacitor** to wrap the web app into a native mobile app.

### Prerequisites
- Node.js installed
- Android Studio (for Android)
- Xcode (for iOS, requires Mac)

### Steps to Build

1.  **Build the web app**:
    ```bash
    npm run build
    ```

2.  **Sync with Capacitor**:
    ```bash
    npx cap sync
    ```

3.  **Open in Android Studio**:
    ```bash
    npx cap open android
    ```
    - Once Android Studio opens, wait for Gradle sync to finish.
    - Connect your device or use an emulator.
    - Click the "Run" (Play) button.

4.  **Open in Xcode (iOS)**:
    ```bash
    npx cap open ios
    ```
    - Select your target device/simulator.
    - Click "Run".

### Customization
- **App Icon/Splash Screen**: To generate icons, put your `logo.png` (1024x1024) in the root and run:
    ```bash
    npm install @capacitor/assets --save-dev
    npx capacitor-assets generate
    ```
- **Config**: Edit `capacitor.config.ts` to change the App ID or Name.

## Troubleshooting

- **PWA Prompt not showing**: Ensure you are serving over HTTPS (or localhost). On some browsers, you may need to interact with the page first.
- **Service Worker errors**: Check the console. If using a self-signed certificate (local), you might need to allow insecure certificates.
