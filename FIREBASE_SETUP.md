# Firebase Setup

This guide explains how to configure Firebase for local development and Netlify deployment.

## 1. Create Firebase Project

1. Go to Firebase Console.
2. Create or select your project.
3. Register a Web App.
4. Copy the Firebase Web configuration values.

## 2. Enable Required Services

1. Authentication
   - Enable Email/Password provider.
2. Firestore Database
   - Create database in Native mode.

## 3. Local Environment Configuration

1. Copy `.env.example` to `.env`.
2. Fill values from your Firebase Web App config:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

## 4. Netlify Environment Configuration

In Netlify site settings, add the same variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

After adding them, trigger a new deploy.

## 5. Firestore Rules (Development)

If you are blocked by permissions during initial tests, use temporary development rules and tighten later:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Use secure role-based rules for production.

## 6. Verify

1. Run `npm run dev` locally.
2. Confirm login and data reads/writes work.
3. Deploy on Netlify and test again in production URL.
