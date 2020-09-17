import firebase from "firebase/app";
import "firebase/firestore";

export class FSChat {

  static async create({ type, owner, character, value = {} }) {
    const db = firebase.firestore();

    const c = {
      type, owner, character, value
    };
    const chatDocRef = await db.collection("chat").add(c);
    c.id = chatDocRef.id;

    return c;
  }
}