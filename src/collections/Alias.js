import store from "@/store";
import firebase from "firebase";

export class FSAlias {
  static unsubscribeMap = new Map();

  static async Create(params) {
    const {
      roomId: room,
      characterId: character,
      imageId: image,
      name,
      position = 1
    } = params;
    const alias = {
      room,
      character,
      image,
      name,
      position
    };
    const db = firebase.firestore();
    const docRef = await db.collection("alias").add(alias);
    alias.id = docRef.id;

    return alias;
  }

  static SetListener(roomId) {
    console.log("Alias.SetListener", roomId); // @DELETEME

    const { unsubscribeMap } = FSAlias;
    if (unsubscribeMap.has(roomId)) {
      FSAlias.RemoveListener(roomId);
    }

    const db = firebase.firestore();
    const docsRef = db.collection("alias").where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const aliases = [];
      querySnapshot.forEach(doc => {
        const alias = doc.data();
        alias.id = doc.id;
        aliases.push(alias);
      });
      store.dispatch("alias/setAliases", { aliases });
    });
    const listener = { roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener(roomId) {
    const { unsubscribeMap } = FSAlias;
    if (!unsubscribeMap.has(roomId)) {
      console.log("no listener found: ", roomId); // @DELETEME
      return false;
    }
    const listener = unsubscribeMap.get(roomId);
    listener.unsubscribe();

    unsubscribeMap.delete(roomId);
  }
}
