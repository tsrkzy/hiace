import store from "@/store";
import firebase from "firebase/app";
import "firebase/firestore";
import { DEFAULT_MAP_IMAGE } from "@/collections/Image";

export class FSMap {
  static unsubscribeMap = new Map();

  static async GetById({ id }: { id: string }) {
    if (!id) {
      return null;
    }
    const db = firebase.firestore();
    const docRef = await db
      .collection("map")
      .doc(id)
      .get();

    if (!docRef.exists) {
      return null;
    }
    const map = docRef.data();

    return { id, ...map };
  }

  static async Create(params: {
    roomId: string;
    userId: string;
    boardId: string;
    imageId: string;
  }) {
    const { roomId, userId, boardId, imageId } = params;

    if (!roomId) {
      throw new Error(`no roomId given`);
    }
    if (!boardId) {
      throw new Error(`no boardId given`);
    }
    const m = {
      room: roomId,
      owner: userId,
      board: boardId,
      image: imageId,
      scalePp: 100,
      offsetLock: true,

      transform: `${new DOMMatrix()}`,

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
    const id = docRef.id;

    return { id, ...m };
  }

  static async CreateDefault(params: {
    roomId: string;
    userId: string;
    boardId: string;
  }) {
    const { roomId, userId, boardId } = params;
    // デバッグ用マップ
    const imageId = DEFAULT_MAP_IMAGE;
    return await FSMap.Create({ roomId, userId, boardId, imageId });
  }

  static async Update(
    mapId: string,
    params: {
      scalePp?: Number;
      offsetLock?: boolean;
      transform?: string;
    }
  ) {
    const db = firebase.firestore();
    const docRef = await db.collection("map").doc(mapId);
    await docRef.update(params);
  }

  static async Delete(mapId: string) {
    const db = firebase.firestore();
    const docRef = await db
      .collection("map")
      .doc(mapId)
      .delete();
    return docRef;
  }

  static async DeleteByBoard(boardId: string) {
    const db = firebase.firestore();
    const querySnapshot = await db
      .collection("map")
      .where("board", "==", boardId)
      .get();

    const batch = db.batch();
    querySnapshot.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
  }

  static async SetImageId(mapId: string, imageId: string) {
    const db = firebase.firestore();
    const mapDocRef = db.collection("map").doc(mapId);
    await mapDocRef.update({ image: imageId });
  }

  static SetListener(roomId: string) {
    console.log("Map.SetListener"); // @DELETEME
    FSMap.RemoveListener();

    const db = firebase.firestore();
    const docsRef = db.collection("map").where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const maps: any[] = [];
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
