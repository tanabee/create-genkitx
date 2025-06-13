## Run Locally

### 1. Set Secrets

Create a `.secret.local` file in the `functions` directory and add your API keys:

```sh
touch functions/.secret.local
```

```env
GEMINI_API_KEY=<your Gemini API key>
SERVICE_API_KEY=<your service API key>
```

- `GEMINI_API_KEY`: Your Google Gemini API key.
- `SERVICE_API_KEY`: A secret key for authenticating API requests. Use a secure, random string.

### 2. Start the App

From the project root, run:

```sh
npm start
```

After starting the app, you can access:
- Genkit developer tools at [http://localhost:1234](http://localhost:1234)
- API endpoints via the Firebase Emulator at [http://localhost:5001](http://localhost:5001)

You can test the API using curl:

```sh
curl -i -X POST \
  -H "Authorization:Bearer <your SERVICE_API_KEY>" \
  -H "Content-Type:application/json" \
  -d '{ "message": "Explain Firebase Genkit in under 200 words." }' \
  'http://localhost:5001/demo-genkitx/us-central1/api/api/messages'
```

Note: After setting the project id in the `Deploy to Firebase` section, please replace the instances of `demo-genkitx` accordingly.

API Endpoint:

- `POST /api/messages`
  - Request body: `{ "message": "<your question>" }`
  - Response: `{ "message": "<AI response>" }`
  - Authentication: Requires `Authorization: Bearer <SERVICE_API_KEY>` header

---

## Deploy to Firebase

1. Create a new Firebase project in the [Firebase console](https://console.firebase.google.com) or select an existing one.
2. Set your Firebase project ID in the `.firebaserc` file under `default`:

```json
{
  "projects": {
    "default": "<your-firebase-project-id>"
  }
}
```

3. Upgrade your project to the Blaze plan (required for Cloud Functions).
4. Install the Firebase CLI:

```sh
npm install -g firebase-tools
```

5. Log in to Firebase:

```sh
firebase login
```

6. Store your API keys in Cloud Secret Manager:

```sh
firebase functions:secrets:set GEMINI_API_KEY
firebase functions:secrets:set SERVICE_API_KEY
```

7. Deploy to Firebase:

```sh
firebase deploy
```

---

## References

- [Official Guide - Deploy flows using Cloud Functions for Firebase](https://genkit.dev/docs/firebase/)