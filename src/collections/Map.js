import store from "@/store";
import firebase from "firebase/app";
import "firebase/firestore";

export class FSMap {
  static unsubscribeMap = new Map();

  static async Create(params) {
    const { roomId, userId, boardId, imageId } = params;
    const m = {
      room: roomId,
      owner: userId,
      board: boardId,
      image: imageId,
      // scale: 1.0,
      // offsetX: 0,
      // offsetY: 0,
      // zIndex: 0,
      grid: {
        cols: 15,
        rows: 15,
        color: "#000000",
        snap: true
      },
      backgroundColor: "#101010"
    };

    const db = firebase.firestore();
    const docRef = await db.collection("map").add(m);
    m.id = docRef.id;
    return m;
  }

  static async CreateDefault(params) {
    const { roomId, userId, boardId } = params;
    // デバッグ用マップ
    const imageId = "HOBcVEBDyENpPg6b2Otc";
    return await FSMap.Create({ roomId, userId, boardId, imageId });
  }

  static async Delete(mapId) {
    const db = firebase.firestore();
    const docRef = await db
      .collection("map")
      .doc(mapId)
      .delete();
    return docRef;
  }

  static async DeleteByBoard(boardId) {
    const db = firebase.firestore();
    const querySnapshot = await db
      .collection("map")
      .where("board", "==", boardId)
      .get();

    const batch = db.batch();
    querySnapshot.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
  }

  static SetListener(roomId) {
    console.log("Map.SetListener"); // @DELETEME
    FSMap.RemoveListener();

    const db = firebase.firestore();
    const docsRef = db.collection("map").where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const maps = [];
      querySnapshot.forEach(doc => {
        const map = doc.data();
        map.id = doc.id;
        maps.push(map);
      });
      store.dispatch("map/setMaps", { maps });
    });

    const { unsubscribeMap } = FSMap;
    const listener = { id: roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener() {
    console.log("Map.RemoveListener"); // @DELETEME
    const { unsubscribeMap } = FSMap;
    const listeners = unsubscribeMap.values();
    for (const l of listeners) {
      const { id, unsubscribe } = l;
      unsubscribe?.();
      console.log(`unsubscribed: ${id}`); // @DELETEME
    }

    unsubscribeMap.clear();
  }
}
