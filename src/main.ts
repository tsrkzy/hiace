import './app.css'
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup, getAdditionalUserInfo } from "firebase/auth";
import App from './App.svelte'
import { auth } from "./store/auth";

const {
  VITE_API_KEY: API_KEY,
  VITE_AUTH_DOMAIN: AUTH_DOMAIN,
  VITE_DATABASE_URL: DATABASE_URL,
  VITE_PROJECT_ID: PROJECT_ID,
  VITE_STORAGE_BUCKET: STORAGE_BUCKET,
  VITE_MESSAGING_SENDER_ID: MESSAGING_SENDER_ID,
  VITE_APP_ID: APP_ID,
  VITE_MEASUREMENT_ID: MEASUREMENT_ID,
} = import.meta.env

/* initialize firebase */
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};
const fb = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
signInWithPopup(getAuth(), provider)
  .then(r => {
    console.log("logged in");
    const {
      user: {
        displayName,
        photoURL,
        email
      }
    } = r;
    auth.set({
      auth: {
        name: displayName,
        photoUrl: photoURL,
        email
      },
      user: {

      }
    })
  })
  .catch((e) => {
    console.error("failed to log in", e);
  });


const app = new App({
  target: document.getElementById('app'),
})

export default app
