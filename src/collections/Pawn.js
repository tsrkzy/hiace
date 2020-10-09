import store from "@/store";
import firebase from "firebase/app";
import "firebase/firestore";

export class FSPawn {
  static unsubscribeMap = new Map();

  static async Create(params) {
    const { roomId, userId, boardId, imageId, characterId } = params;
    const p = {
      room: roomId,
      owner: userId,
      board: boardId,
      image: imageId,
      character: characterId
    };

    const db = firebase.firestore();
    const docRef = await db.collection("pawn").add(p);
    p.id = docRef.id;
    return p;
  }

  static async CreateDefault(params) {
    const { roomId, userId, boardId, characterId } = params;
    const imageId = "1jjkgQXy7J83NAlAkaRm";
    return await FSPawn.Create({
      roomId,
      userId,
      boardId,
      imageId,
      characterId
    });
  }

  static async Delete(pawnId) {
    const db = firebase.firestore();
    const docRef = await db
      .collection("pawn")
      .doc(pawnId)
      .delete();
    return docRef;
  }

  static async DeleteByBoard(boardId) {
    const db = firebase.firestore();
    const querySnapshot = await db
      .collection("pawn")
      .where("board", "==", boardId)
      .get();

    const batch = db.batch();
    querySnapshot.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
  }

  static SetListener(roomId) {
    console.log("Pawn.SetListener"); // @DELETEME
    FSPawn.RemoveListener();

    const db = firebase.firestore();
    const docsRef = db.collection("pawn").where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const pawns = [];
      querySnapshot.forEach(doc => {
        const pawn = doc.data();
        pawn.id = doc.id;
        pawns.push(pawn);
      });
      store.dispatch("pawn/setPawns", { pawns });
    });

    const { unsubscribeMap } = FSPawn;
    const listener = { id: roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener() {
    console.log("Pawn.RemoveListener"); // @DELETEME
    const { unsubscribeMap } = FSPawn;
    const listeners = unsubscribeMap.values();
    for (const l of listeners) {
      const { id, unsubscribe } = l;
      unsubscribe?.();
      console.log(`unsubscribed: ${id}`); // @DELETEME
    }

    unsubscribeMap.clear();
  }
}
