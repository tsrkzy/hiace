import { initializeApp } from "firebase/app";

const {
  VITE_API_KEY: API_KEY,
  VITE_AUTH_DOMAIN: AUTH_DOMAIN,
  VITE_DATABASE_URL: DATABASE_URL,
  VITE_PROJECT_ID: PROJECT_ID,
  VITE_STORAGE_BUCKET: STORAGE_BUCKET,
  VITE_MESSAGING_SENDER_ID: MESSAGING_SENDER_ID,
  VITE_APP_ID: APP_ID,
  VITE_MEASUREMENT_ID: MEASUREMENT_ID,
} = import.meta.env;

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

console.log("initialized"); // @DELETEME
export const firebaseApp = initializeApp(firebaseConfig);
