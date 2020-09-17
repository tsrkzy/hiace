import firebase from "firebase/app";
import "firebase/firestore";

export class FSLog {

  static async create({ name, chats = [], subscribers = [] }) {
    const db = firebase.firestore();

    const log = {
      name,
      chats,
      subscribers,
    };
    const logDocRef = await db.collection("log").add(log);
    log.id = logDocRef.id;

    return log;
  }
}