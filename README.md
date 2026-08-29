# AI Travel Planner - Android & Web App

A full-featured AI Travel Planner mobile application built with React, Tailwind CSS, TypeScript, and Capacitor Native Android.

## 🚀 How to Build the Android APK via GitHub Actions (Zero Local Setup)

This repository includes a pre-configured **GitHub Actions CI/CD pipeline** that compiles the Android APK directly on GitHub cloud runners.

### Steps to Download Your APK:

1. **Push this code to GitHub** (or fork/import it).
2. Go to the **Actions** tab on your GitHub repository.
3. In the left sidebar, click **"Build & Generate Android APK"**.
4. Click the **"Run workflow"** button (select `main` or `master` branch) and confirm.
5. Wait ~2 minutes for the workflow run to finish with a green checkmark (`✔`).
6. Click on the completed run, scroll down to the **Artifacts** section at the bottom, and click **`AI-Travel-Planner-Android-APK`** to download your zip file containing `app-debug.apk`.
7. Install `app-debug.apk` directly on your Android phone!

---

## 💻 Local Development (Web App)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for web & sync native Android assets
npm run cap:build
```
