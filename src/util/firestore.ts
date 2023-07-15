import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "./firebaseApp";

console.log("initialize db");
export const db = getFirestore(firebaseApp);
