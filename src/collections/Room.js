import { FSUser } from "@/collections/User";
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

    await FSUser.joinRoom(owner.id, room.id);

    return room;
  }

  static async grantRequest(userId) {
    console.log("Room.grantRequest", userId); // @DELETEME
    const room = store.getters["room/info"];
    if (room.requests.indexOf(userId) === -1) {
      throw new Error(`no request found: ${userId}`);
    }
    if (room.users.indexOf(userId) !== -1) {
      console.log(`already granted: ${userId}`); // @DELETEME
      return false;
    }
    const requests = room.requests.filter(id => id !== userId);
    const users = room.users.slice();
    users.push(userId);

    const db = firebase.firestore();

    const roomDoc = db.collection("room").doc(room.id);
    await roomDoc.update({ requests, users });
    FSUser.joinRoom(userId, room.id);
  }

  static async dropUser(userId) {
    console.log("Room.dropUser", userId); // @DELETEME
    const room = store.getters["room/info"];
    if (room.users.indexOf(userId) === -1) {
      throw new Error(`no user found: ${userId}`);
    }
    if (room.owner === userId) {
      throw new Error(`cannnot drop owner: ${userId}`);
    }
    const users = room.users.filter(u => u !== userId);

    const db = firebase.firestore();
    const doc = db.collection("room").doc(room.id);
    await doc.update({ users });
  }

  static async kickUser(userId) {
    console.log("Room.kickUser", userId); // @DELETEME
    const room = store.getters["room/info"];
    if (room.kicked.indexOf(userId) !== -1) {
      throw new Error(`already kicked: ${userId}`);
    }
    if (room.owner === userId) {
      throw new Error("cannot kick owner");
    }
    const users = room.users.filter(u => u !== userId);
    const requests = room.requests.filter(u => u !== userId);
    const kicked = room.kicked.slice();
    kicked.push(userId);

    const db = firebase.firestore();
    const doc = db.collection("room").doc(room.id);
    await doc.update({ users, requests, kicked });
  }

  static async makeRequest(userId) {
    console.log("Room.makeRequest", userId); // @DELETEME
    const room = store.getters["room/info"];
    if (room.requests.indexOf(userId) !== -1) {
      throw new Error("already requested.");
    }
    if (room.users.indexOf(userId) !== -1) {
      throw new Error("already joined.");
    }

    const requests = room.requests.slice();
    requests.push(userId);
    const db = firebase.firestore();
    const doc = db.collection("room").doc(room.id);
    await doc.update({ requests });
  }


  static setListener(room) {
    const id = room.id;
    const db = firebase.firestore();
    const docRef = db.collection("room").doc(id);
    const unsubscribe = docRef.onSnapshot((doc) => {
      const room = doc.data();
      room.id = doc.id;
      store.dispatch("room/setRoom", { room });
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
}
