import store from "@/store";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

export class FSArrow {
  static unsubscribeMap = new Map();

  static async GetById({ id }: { id: string }) {
    if (!id) {
      return null;
    }
    const db = firebase.firestore();
    const docRef = await db.collection("arrow").doc(id).get();

    if (!docRef.exists) {
      return null;
    }
    const arrow = docRef.data();

    return { id, ...arrow };
  }

  static async Create(params: {
    roomId: string;
    userId: string;
    pawnIdFrom: string;
    pawnIdTo: string;
  }) {
    const { roomId, userId, pawnIdFrom, pawnIdTo } = params;

    if (!roomId) {
      throw new Error("no roomId given");
    }
    if (!userId) {
      throw new Error("no userId given");
    }
    if (!pawnIdFrom) {
      throw new Error("no pawnIdFrom given");
    }
    if (!pawnIdTo) {
      throw new Error("no pawnIdTo given");
    }

    /* 既に存在していたらそれを返す */
    const sameArrow = store.getters["arrow/info"].find(
      (a: { pawnFrom: string; pawnTo: string }) =>
        a.pawnFrom === pawnIdFrom && a.pawnTo === pawnIdTo
    );
    if (sameArrow) {
      return sameArrow;
    }

    /* 逆向きの物が存在していたらそれを逆向きに更新する */
    const existsInvert = store.getters["arrow/info"].find(
      (a: { id: string; pawnFrom: string; pawnTo: string }) =>
        a.pawnFrom === pawnIdTo && a.pawnTo === pawnIdFrom
    );
    if (existsInvert) {
      return await FSArrow.Update(existsInvert.id, {
        pawnFrom: pawnIdFrom,
        pawnTo: pawnIdTo,
      });
    }

    const a = {
      room: roomId,
      owner: userId,
      pawnFrom: pawnIdFrom,
      pawnTo: pawnIdTo,
    };

    const db = firebase.firestore();
    const docRef = await db.collection("arrow").add(a);
    const id = docRef.id;

    return { id, ...a };
  }
  static async Update(
    arrowId: string,
    p: { pawnFrom: string; pawnTo: string }
  ) {
    const { pawnFrom, pawnTo } = p;
    const db = firebase.firestore();
    const docRef = await db.collection("arrow").doc(arrowId);
    const criteria = {
      pawnFrom,
      pawnTo,
    };
    return await docRef.update(criteria);
  }
  static async Delete(arrowId: string) {
    const db = firebase.firestore();
    const docRef = await db.collection("arrow").doc(arrowId).delete();
    return docRef;
  }

  static async DeleteByPawn(pawnId: string) {
    console.log("Arrow.DeleteByPawn");
    const arrows = store.getters["arrow/info"].filter(
      (a: { pawnFrom: string; pawnTo: string }) =>
        a.pawnFrom === pawnId || a.pawnTo === pawnId
    );

    const db = firebase.firestore();
    const batch = db.batch();
    for (let i = 0; i < arrows.length; i++) {
      const { id: arrowId } = arrows[i];
      batch.delete(db.collection("arrow").doc(arrowId));
    }
    await batch.commit();
  }

  static SetListener(roomId: string) {
    console.log("Arrow.SetListener"); // @DELETEME
    FSArrow.RemoveListener();

    const db = firebase.firestore();
    const docsRef = db.collection("arrow").where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot((querySnapshot) => {
      const arrows: any[] = [];
      querySnapshot.forEach((doc) => {
        const arrow = doc.data();
        arrow.id = doc.id;
        arrows.push(arrow);
      });
      store.dispatch("arrow/setArrows", { arrows });
    });

    const { unsubscribeMap } = FSArrow;
    const listener = { id: roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener() {
    console.log("Arrow.RemoveListener"); // @DELETEME
    const { unsubscribeMap } = FSArrow;
    const listeners = unsubscribeMap.values();
    for (const l of listeners) {
      const { id, unsubscribe } = l;
      unsubscribe?.();
      console.log(`unsubscribed: ${id}`); // @DELETEME
    }

    unsubscribeMap.clear();
  }
}
