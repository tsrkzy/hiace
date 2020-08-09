import firebase from "firebase/app";
import "firebase/firestore";
import store from "@/store";

export class FSRoom {
  static listeners = [];


  static async getById({ id }) {
    const db = firebase.firestore();
    const docRef = await db.collection("room").doc(id).get();
    if (!docRef.exists) {
      return null;
    }
    const room = docRef.data();
    room.id = id;
    return room;
  }

  static async create({ name, owner }) {
    const db = firebase.firestore();
    const room = {
      name,
      owner: owner.id, // 部屋作成時に固定
      keepers: [owner.id], // 初期値ownerのみ、追加削除可能
      requests: [],
      kicked: [],
      users: [owner.id], // 初期値ownerのみ、追加可能
      characters: [],
      // logs: ["log_1", "log_2"],
      // resources: ["resource_1"], // 共有リソース
      // gameSystem: "cthuluhu",
      // activeMap: "map_1", // マップセット切り替え
      // maps: ["map_1", "map_2"],
      /* watchして再生切り替える必要あり */
      // soundEffects: ["soundEffect_1", "soundEffect_2"],
      // musics: "music_1"
    };
    const roomDocRef = await db.collection("room").add(room);
    room.id = roomDocRef.id;

    return room;
  }

  static setListener(room) {
    const id = room.id;
    const db = firebase.firestore();
    const docRef = db.collection("room").doc(id);
    const unsubscribe = docRef.onSnapshot((doc) => {
      store.dispatch("room/setRoom", { room: doc.data() });
    });
    FSRoom.listeners.push({ id, unsubscribe });
  }

  static removeListener(room) {
    const id = room.id;
    const listeners = FSRoom.listeners.filter(l => l.id === id);
    for (let i = 0; i < listeners.length; i++) {
      let listener = listeners[i];
      listener.unsubscribe();
    }
    FSRoom.listeners = FSRoom.listeners.filter(l => l.id !== id);
  }

  // static on(id, key, handler) {
  //   const db = firebase.firestore();
  //   const docRef = db.collection("room").doc(id);
  //   const unsubscribe = docRef.onSnapshot(handler);
  //   FSRoom.listeners.push({ key, unsubscribe });
  // }
  //
  // static off(keyStartsWith) {
  //   const listeners = FSRoom.listeners.filter(l => l.key.startsWith(keyStartsWith));
  //   listeners.forEach(l => l.unsubscribe());
  //   FSRoom.listeners = FSRoom.listeners.filter(l => !l.key.startsWith(keyStartsWith));
  // }
}
