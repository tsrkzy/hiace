import { FSChat } from "@/collections/Chat";
import { FSLog } from "@/collections/Log";
import { FSUser } from "@/collections/User";
import firebase from "firebase/app";
import "firebase/firestore";
import store from "@/store";

export class FSRoom {
  static listeners = [];
  static IdMap = new Map();

  /* instance */
  id = null;
  name;
  owner;
  keepers = [];
  requests = [];
  kicked = [];
  users = [];
  characters = [];
  logs = {
    master: null,
    channels: []
  };

  /**
   * FSまたはMapから該当するidのroomのデータを取得し、インスタンスへ整形して返す
   * @param id
   * @return {Promise<FSRoom>}
   */
  static async GetById({ id }) {
    /* hashMapまたはFSから取得 */
    const { IdMap } = FSRoom;
    let fsR = IdMap.get(id);
    if (fsR) {
      return fsR;
    }

    IdMap.delete(id);

    const db = firebase.firestore();
    const docRef = await db.collection("room").doc(id).get();

    if (!docRef.exists) {
      return null;
    }
    const room = docRef.data();
    room.id = id;
    IdMap.set(id, room);

    return Promise.resolve(room);
  }

  /**
   * FSへroomのデータを登録し、id()込みのインスタンスへ整形して返す
   * @param params
   * @return {Promise<FSRoom>}
   */
  static async Add(params) {
    const room = new FSRoom(params
      //   {
      //   name,
      //   owner: owner.id, // 部屋作成時に固定
      //   keepers: [owner.id], // 初期値ownerのみ、追加削除可能
      //   requests: [],
      //   kicked: [],
      //   users: [owner.id], // 初期値ownerのみ、追加可能
      //   characters: [],
      //   logs: {
      //     master: log.id,
      //     channels: [],
      //   }
      //   resources: ["resource_1"], // 共有リソース
      //   gameSystem: "cthuluhu",
      //   activeMap: "map_1", // マップセット切り替え
      //   maps: ["map_1", "map_2"],
      //   /* watchして再生切り替える必要あり */
      //   soundEffects: ["soundEffect_1", "soundEffect_2"],
      //   musics: "music_1"
      // }
    );
    await room.add();

    return room;
  }

  async add() {
    const db = firebase.firestore();
    const docRef = await db.collection("room").add(this.toObj());
    this.id = docRef.id;

    const { IdMap } = FSRoom;
    IdMap.set(this.id, this);
  }

  dispose() {
    const { id } = this;
    const { IdMap } = FSRoom;
    /* hashMapから削除 */
    IdMap.delete(id);
    /* snapShotを削除 */
    FSRoom.RemoveListener(id);
  }

  constructor(params) {
    const {
      // id = null,
      name = "name",
      owner = "owner",
      keepers = [],
      requests = [],
      kicked = [],
      users = [],
      characters = [],
      logs = {
        master: null,
        channels: []
      },
    } = params;
    // this.id = id;
    this.name = name;
    this.owner = owner;
    this.keepers = keepers;
    this.requests = requests;
    this.kicked = kicked;
    this.users = users;
    this.characters = characters;
    this.logs = logs;
  }

  toObj() {
    const {
      id,
      name,
      owner,
      keepers,
      requests,
      kicked,
      users,
      characters,
      logs,
    } = this;

    const o = {
      name,
      owner,
      keepers,
      requests,
      kicked,
      users,
      characters,
      logs,
    };
    if (id) {
      o.id = id;
    }

    return o;
  }

  static async Create({ name, owner }) {
    const c = {
      type: "text",
      owner: "user_1",
      character: "character_1",
      value: { text: "welcome to hiace!" },
    };
    const welcomeChat = await FSChat.create(c);

    /* master logを作成 */
    const l = {
      name: "",
      chats: [welcomeChat.id],
      subscribers: [],
    };
    const log = await FSLog.create(l);

    const r = {
      name,
      owner: owner.id, // 部屋作成時に固定
      keepers: [owner.id], // 初期値ownerのみ、追加削除可能
      requests: [],
      kicked: [],
      users: [owner.id], // 初期値ownerのみ、追加可能
      characters: [],
      logs: {
        master: log.id,
        channels: [],
      }
      // resources: ["resource_1"], // 共有リソース
      // gameSystem: "cthuluhu",
      // activeMap: "map_1", // マップセット切り替え
      // maps: ["map_1", "map_2"],
      /* watchして再生切り替える必要あり */
      // soundEffects: ["soundEffect_1", "soundEffect_2"],
      // musics: "music_1"
    };
    const room = await FSRoom.Add(r);

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
    FSUser.joinRoom(userId, room.id);
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
    const unsubscribe = docRef.onSnapshot((doc) => {
      const room = doc.data();
      room.id = doc.id;
      store.dispatch("room/setRoom", { room });
    });
    FSRoom.listeners.push({ id, unsubscribe });
  }

  static RemoveListener(roomId) {
    const listeners = FSRoom.listeners.filter(l => l.id === roomId);
    for (let i = 0; i < listeners.length; i++) {
      let listener = listeners[i];
      listener.unsubscribe();
    }
    FSRoom.listeners = FSRoom.listeners.filter(l => l.id !== roomId);
  }
}
