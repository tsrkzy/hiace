import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseApp } from "./firebaseApp";

console.log("initialize db");
export const db = getFirestore(firebaseApp);
export const storage = getStorage();
