import store from "@/store";
import firebase from "firebase/app";
import "firebase/firestore";

export const DICE_SIZE = 100;

/* dice color */
export const DICE_BLACK = "black";
export const DICE_RED = "red";
export const DICE_WHITE = "white";
export const DICE_EYE_COLOR = {
  [DICE_BLACK]: "white",
  [DICE_RED]: "white",
  [DICE_WHITE]: "black"
};

/* die */

export const DICE_VALUE_ONE = "ONE";
export const DICE_VALUE_TWO = "TWO";
export const DICE_VALUE_THREE = "THREE";
export const DICE_VALUE_FOUR = "FOUR";
export const DICE_VALUE_FIVE = "FIVE";
export const DICE_VALUE_SIX = "SIX";
export const DICE_VALUE_ASTER = "ASTER";
export const DICE_LABEL_ONE = "1";
export const DICE_LABEL_TWO = "2";
export const DICE_LABEL_THREE = "3";
export const DICE_LABEL_FOUR = "4";
export const DICE_LABEL_FIVE = "5";
export const DICE_LABEL_SIX = "6";
export const DICE_LABEL_ASTER = "*";

export function faceLabelToValue(l: string) {
  let v = "";
  switch (l) {
    case DICE_LABEL_ONE:
      v = DICE_VALUE_ONE;
      break;
    case DICE_LABEL_TWO:
      v = DICE_VALUE_TWO;
      break;
    case DICE_LABEL_THREE:
      v = DICE_VALUE_THREE;
      break;
    case DICE_LABEL_FOUR:
      v = DICE_VALUE_FOUR;
      break;
    case DICE_LABEL_FIVE:
      v = DICE_VALUE_FIVE;
      break;
    case DICE_LABEL_SIX:
      v = DICE_VALUE_SIX;
      break;
    case DICE_LABEL_ASTER:
      v = DICE_VALUE_ASTER;
      break;
  }

  return v;
}
export function faceValueToLabel(n: string) {
  let l = "";
  switch (n) {
    case DICE_VALUE_ONE:
      l = DICE_LABEL_ONE;
      break;
    case DICE_VALUE_TWO:
      l = DICE_LABEL_TWO;
      break;
    case DICE_VALUE_THREE:
      l = DICE_LABEL_THREE;
      break;
    case DICE_VALUE_FOUR:
      l = DICE_LABEL_FOUR;
      break;
    case DICE_VALUE_FIVE:
      l = DICE_LABEL_FIVE;
      break;
    case DICE_VALUE_SIX:
      l = DICE_LABEL_SIX;
      break;
    case DICE_VALUE_ASTER:
      l = DICE_LABEL_ASTER;
      break;
  }

  return l;
}

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
      color: color ?? DICE_BLACK,
      face: face ?? DICE_VALUE_ASTER,
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

  static async Roll(diceId: string) {
    /* ダイスの目をランダムに変更する */
    const _newFace = `${(Math.floor(Math.random() * 10) % 6) + 1}`;
    const newFace = faceLabelToValue(_newFace);
    const { face: oldFace } = store.getters["dice/info"].find(
      (d: { id: string; face: string }) => d.id === diceId
    );

    const criteria = { face: newFace };
    await FSDice.Update(diceId, criteria);
    const newFaceLabel = faceValueToLabel(newFace);
    const oldFaceLabel = faceValueToLabel(oldFace);
    return { newFace: newFaceLabel, oldFace: oldFaceLabel };
  }

  static async Touch(diceId: string) {
    const db = firebase.firestore();
    const docRef = await db.collection("dice").doc(diceId);
    const params = {
      updatedAt: Date.now()
    };
    return await docRef.update(params);
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
