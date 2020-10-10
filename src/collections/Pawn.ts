import store from "@/store";
import firebase from "firebase/app";
import "firebase/firestore";

export class FSPawn {
  static unsubscribeMap = new Map();

  static async Create(params: {
    roomId: string;
    userId: string;
    boardId: string;
    imageId: string;
    characterId: string;
  }) {
    const { roomId, userId, boardId, imageId, characterId } = params;

    if (!roomId) {
      throw new Error("no roomId given");
    }
    if (!userId) {
      throw new Error("no userId given");
    }
    if (!boardId) {
      throw new Error("no boardId given");
    }
    if (!characterId) {
      throw new Error("no characterId given");
    }

    const p = {
      room: roomId,
      owner: userId,
      board: boardId,
      image: imageId,
      character: characterId
    };

    const db = firebase.firestore();
    const docRef = await db.collection("pawn").add(p);
    const id = docRef.id;

    return { id, ...p };
  }

  static async Delete(pawnId: string) {
    const db = firebase.firestore();
    const docRef = await db
      .collection("pawn")
      .doc(pawnId)
      .delete();
    return docRef;
  }

  static async DeleteByBoard(boardId: string) {
    const db = firebase.firestore();
    const querySnapshot = await db
      .collection("pawn")
      .where("board", "==", boardId)
      .get();

    const batch = db.batch();
    querySnapshot.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
  }

  static SetListener(roomId: string) {
    console.log("Pawn.SetListener"); // @DELETEME
    FSPawn.RemoveListener();

    const db = firebase.firestore();
    const docsRef = db.collection("pawn").where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const pawns: any[] = [];
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
