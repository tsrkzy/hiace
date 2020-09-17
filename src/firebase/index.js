import firebase from "firebase/app";
import "firebase/firestore";

console.log('import firebase'); // @DELETEME
const {
  VUE_APP_API_KEY: API_KEY,
  VUE_APP_AUTH_DOMAIN: AUTH_DOMAIN,
  VUE_APP_DATABASE_URL: DATABASE_URL,
  VUE_APP_PROJECT_ID: PROJECT_ID,
  VUE_APP_STORAGE_BUCKET: STORAGE_BUCKET,
  VUE_APP_MESSAGING_SENDER_ID: MESSAGING_SENDER_ID,
  VUE_APP_APP_ID: APP_ID,
  VUE_APP_MEASUREMENT_ID: MEASUREMENT_ID,
} = process.env;

/* initialize firebase */
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID
};
export const app = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();