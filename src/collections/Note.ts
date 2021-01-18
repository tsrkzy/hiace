import store from "@/store";
import firebase from "firebase/app";
import "firebase/firestore";

export class FSNote {
  static unsubscribeMap = new Map();

  static async Create(params: { roomId: string; name: string; text: string }) {
    const { roomId, name, text } = params;
    const n = {
      room: roomId,
      name,
      text
    };

    if (!roomId) {
      throw new Error("no roomId given");
    }

    const db = firebase.firestore();
    const docRef = await db.collection("note").add(n);
    const id = docRef.id;
    return { id, ...n };
  }

  static async Update(noteId: string, criteria: object) {
    const db = firebase.firestore();
    const docRef = await db.collection("note").doc(noteId);
    return await docRef.update(criteria);
  }

  static SetListener(roomId: string) {
    console.log("Note.SetListener"); // @DELETEME
    FSNote.RemoveListener();

    const db = firebase.firestore();
    const docsRef = db.collection("note").where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const notes: any[] = [];
      querySnapshot.forEach(doc => {
        const note = doc.data();
        note.id = doc.id;
        notes.push(note);
      });
      store.dispatch("note/setNotes", { notes });
    });

    const { unsubscribeMap } = FSNote;
    const listener = { id: roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener() {
    console.log("Note.RemoveListener"); // @DELETEME
    const { unsubscribeMap } = FSNote;
    const listeners = unsubscribeMap.values();
    for (const l of listeners) {
      const { id, unsubscribe } = l;
      unsubscribe?.();
      console.log(`unsubscribed: ${id}`); // @DELETEME
    }

    unsubscribeMap.clear();
  }
}
