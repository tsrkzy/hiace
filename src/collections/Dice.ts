import store from "@/store";
import firebase from "firebase/app";
import "firebase/firestore";

export const DICE_SIZE = 40;
export class FSDice {
  static unsubscribeMap = new Map();

  static async GetById({ id }: { id: string }) {
    if (!id) {
      return null;
    }
    const db = firebase.firestore();
    const docRef = await db
      .collection("dice")
      .doc(id)
      .get();

    if (!docRef.exists) {
      return null;
    }
    const dice = docRef.data();

    return { id, ...dice };
  }

  static async Create(params: {
    boardId: string;
    roomId: string;
    userId: string;
    transform?: string | DOMMatrix;
    color?: string;
    face?: string;
  }) {
    const { boardId, roomId, userId, transform, color, face } = params;

    if (!boardId) {
      throw new Error("no boardId given");
    }
    if (!roomId) {
      throw new Error("no roomId given");
    }
    if (!userId) {
      throw new Error("no userId given");
    }

    const d = {
      board: boardId,
      room: roomId,
      owner: userId,
      transform: `${transform ?? new DOMMatrix()}`,
      color: color ?? "black",
      face: face ?? "*",
      hidden: false,
      updatedAt: Date.now()
    };

    const db = firebase.firestore();
    const docRef = await db.collection("dice").add(d);
    const id = docRef.id;

    return { id, ...d };
  }

  static async Update(diceId: string, criteria: object) {
    const db = firebase.firestore();
    const docRef = await db.collection("dice").doc(diceId);
    return await docRef.update(criteria);
  }

  static async ResetTransform(diceIdList: string[]) {
    const db = firebase.firestore();
    const batch = db.batch();
    for (let i = 0; i < diceIdList.length; i++) {
      const diceId = diceIdList[i];
      const docRef = await db.collection("dice").doc(diceId);
      batch.update(docRef, {
        transform: `${new DOMMatrix()}`,
        updatedAt: Date.now()
      });
    }

    await batch.commit();
  }

  static async Delete(diceId: string) {
    const db = firebase.firestore();
    const docRef = await db
      .collection("dice")
      .doc(diceId)
      .delete();
    return docRef;
  }

  static async DeleteByBoard(boardId: string) {
    const db = firebase.firestore();
    const querySnapshot = await db
      .collection("dice")
      .where("board", "==", boardId)
      .get();

    const batch = db.batch();
    querySnapshot.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
  }

  static SetListener(roomId: string) {
    console.log("Dice.SetListener", roomId); // @DELETEME
    FSDice.RemoveListener();

    const db = firebase.firestore();
    const docsRef = db
      .collection("dice")
      .where("room", "==", roomId)
      .orderBy("updatedAt", "desc");

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const dices: any[] = [];
      querySnapshot.forEach(doc => {
        const dice = doc.data();
        dice.id = doc.id;
        dices.push(dice);
      });
      store.dispatch("dice/setDices", { dices });
    });

    const { unsubscribeMap } = FSDice;
    const listener = { id: roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener() {
    console.log("Dice.RemoveListener"); // @DELETEME
    const { unsubscribeMap } = FSDice;
    const listeners = unsubscribeMap.values();
    for (const l of listeners) {
      const { id, unsubscribe } = l;
      unsubscribe?.();
      console.log(`unsubscribed: ${id}`); // @DELETEME
    }

    unsubscribeMap.clear();
  }
}
