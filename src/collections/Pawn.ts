import store from "@/store";
import firebase from "firebase/app";
import "firebase/firestore";
import { DEFAULT_CHARACTER_IMAGE } from "@/collections/Image";

export class FSPawn {
  static unsubscribeMap = new Map();

  static async GetById({ id }: { id: string }) {
    if (!id) {
      return null;
    }
    const db = firebase.firestore();
    const docRef = await db
      .collection("pawn")
      .doc(id)
      .get();

    if (!docRef.exists) {
      return null;
    }
    const pawn = docRef.data();

    return { id, ...pawn };
  }

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
      image: imageId ?? DEFAULT_CHARACTER_IMAGE,
      character: characterId,
      transform: `${new DOMMatrix()}`,
      updatedAt: Date.now()
    };

    const db = firebase.firestore();
    const docRef = await db.collection("pawn").add(p);
    const id = docRef.id;

    return { id, ...p };
  }

  static async Update(
    pawnId: string,
    p: {
      transform: string;
    }
  ) {
    const db = firebase.firestore();
    const docRef = await db.collection("pawn").doc(pawnId);
    const params = {
      transform: p.transform,
      updatedAt: Date.now()
    };

    await docRef.update(params);
  }

  static async ResetTransform(pawnIdList: string[]) {
    const db = firebase.firestore();
    const batch = db.batch();
    for (let i = 0; i < pawnIdList.length; i++) {
      const pawnId = pawnIdList[i];
      const docRef = await db.collection("pawn").doc(pawnId);
      batch.update(docRef, {
        transform: `${new DOMMatrix()}`,
        updatedAt: Date.now()
      });
    }

    await batch.commit();
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

  static async DeleteByCharacter(characterId: string) {
    const db = firebase.firestore();
    const querySnapshot = await db
      .collection("pawn")
      .where("character", "==", characterId)
      .get();

    const batch = db.batch();
    querySnapshot.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
  }

  static SetListener(roomId: string) {
    console.log("Pawn.SetListener"); // @DELETEME
    FSPawn.RemoveListener();

    const db = firebase.firestore();
    const docsRef = db
      .collection("pawn")
      .where("room", "==", roomId)
      .orderBy("updatedAt", "desc");

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
