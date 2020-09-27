import { SYSTEM_CHANNEL_ID } from "@/collections/Channel";
import { FSChat } from "@/collections/Chat";
import { FSUser } from "@/collections/User";
import firebase from "firebase/app";
import "firebase/firestore";
import store from "@/store";

export class FSRoom {
  static unsubscribeMap = new Map();

  /**
   * FSから該当するidのroomのデータを取得
   * @param id
   * @return {Promise<firebase.firestore.DocumentData>}
   */
  static async GetById({ id }) {
    const db = firebase.firestore();
    const docRef = await db
      .collection("room")
      .doc(id)
      .get();

    if (!docRef.exists) {
      return null;
    }
    const room = docRef.data();
    room.id = id;

    return room;
  }

  /**
   * FSへroomのデータを登録し、id()込みのインスタンスへ整形して返す
   * @param r
   */
  static async Add(r) {
    //   {
    //   name,
    //   owner: owner.id, // 部屋作成時に固定
    //   keepers: [owner.id], // 初期値ownerのみ、追加削除可能
    //   requests: [],
    //   kicked: [],
    //   users: [owner.id], // 初期値ownerのみ、追加可能
    //   characters: [],
    //   resources: ["resource_1"], // 共有リソース
    //   gameSystem: "cthuluhu",
    //   activeMap: "map_1", // マップセット切り替え
    //   maps: ["map_1", "map_2"],
    //   /* watchして再生切り替える必要あり */
    //   soundEffects: ["soundEffect_1", "soundEffect_2"],
    //   musics: "music_1"
    // }

    const db = firebase.firestore();
    const docRef = await db.collection("room").add(r);
    r.id = docRef.id;

    return r;
  }

  static async Create({ name, owner }) {
    const r = {
      name,
      owner: owner.id, // 部屋作成時に固定
      keepers: [owner.id], // 初期値ownerのみ、追加削除可能
      requests: [],
      kicked: [],
      users: [owner.id], // 初期値ownerのみ、追加可能
      characters: []
      // resources: ["resource_1"], // 共有リソース
      // gameSystem: "cthuluhu",
      // activeMap: "map_1", // マップセット切り替え
      // maps: ["map_1", "map_2"],
      /* watchして再生切り替える必要あり */
      // soundEffects: ["soundEffect_1", "soundEffect_2"],
      // musics: "music_1"
    };
    const room = await FSRoom.Add(r);

    const c = {
      type: "system",
      room: room.id,
      channel: SYSTEM_CHANNEL_ID, // As CHANNEL_SYSTEM
      owner: owner.id,
      character: null,
      value: { text: "welcome to hiace!" }
    };
    await FSChat.Create(c);

    return room;
  }

  /**
   * 入室リクエストの承認
   * @param userId
   * @return {Promise<boolean>}
   * @constructor
   */
  static async GrantRequest(userId) {
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
    FSUser.JoinRoom(userId, room.id);
  }

  /**
   * 入室済みユーザを退室させる
   * @param userId
   * @return {Promise<void>}
   * @constructor
   */
  static async DropUser(userId) {
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

  /**
   * ユーザの追放
   * @param userId
   * @return {Promise<void>}
   */
  static async KickUser(userId) {
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

  /**
   * 入室リクエストの作成
   * @param userId
   * @return {Promise<void>}
   */
  static async MakeRequest(userId) {
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

  static SetListener(room) {
    const id = room.id;
    const db = firebase.firestore();
    const docRef = db.collection("room").doc(id);
    const unsubscribe = docRef.onSnapshot(doc => {
      const room = doc.data();
      room.id = doc.id;
      store.dispatch("room/setRoom", { room });
    });
    FSRoom.unsubscribeMap.set(id, { id, unsubscribe });
  }

  static RemoveListener(roomId) {
    console.log("Room.RemoveListener", roomId); // @DELETEME
    const listener = FSRoom.unsubscribeMap.get(roomId);
    if (!listener) {
      return false;
    }

    listener.unsubscribe();
    console.log("unsubscribed"); // @DELETEME
    FSRoom.unsubscribeMap.delete(roomId);
  }
}
