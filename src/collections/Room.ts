import { FSBoard } from "@/collections/Board";
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
  static async GetById({ id }: { id: string }) {
    if (!id) {
      return null;
    }
    const db = firebase.firestore();
    const docRef = await db
      .collection("room")
      .doc(id)
      .get();

    if (!docRef.exists) {
      return null;
    }
    const room = docRef.data();

    return { id, ...room };
  }

  /**
   * FSへroomのデータを登録し、id()込みのインスタンスへ整形して返す
   * @param r
   */
  static async Add(r: {
    name: string;
    owner: string;
    keepers: string[];
    requests: string[];
    kicked: string[];
    users: string[];
    gameSystem: string;
    activeBoard: null;
    music: null;
  }) {
    const db = firebase.firestore();
    const docRef = await db.collection("room").add(r);
    const id = docRef.id;

    return { id, ...r };
  }

  static async Create({
    name,
    owner,
    gameSystem
  }: {
    name: string;
    owner: string;
    gameSystem: string;
  }) {
    if (!owner) {
      throw new Error("no owner given");
    }

    const r = {
      name,
      owner: owner, // 部屋作成時に固定
      keepers: [owner], // 初期値ownerのみ、追加削除可能
      requests: [],
      kicked: [],
      users: [owner], // 初期値ownerのみ、追加可能
      gameSystem,
      activeBoard: null,
      music: null
    };
    const room = await FSRoom.Add(r);
    const id = room.id;

    await FSChat.Welcome(id, owner);

    /* 開始時デフォルトのBoardを作成してactiveに指定 */
    const b = await FSBoard.CreateDefault({
      roomId: id,
      userId: owner
    });
    await FSRoom.SetActiveBoard(id, b.id);

    return { id, ...r };
  }

  static async SoundBroadcast(roomId: string, soundId: string) {
    const db = firebase.firestore();
    const docRef = db.collection("room").doc(roomId);

    await docRef.update({ music: null });
    await docRef.update({ music: soundId });
  }

  static async SoundStop(roomId: string) {
    const db = firebase.firestore();
    const docRef = db.collection("room").doc(roomId);

    await docRef.update({ music: null });
  }

  static async SetActiveBoard(roomId: string, boardId: string) {
    console.log("Room.SetActiveBoard", roomId, boardId); // @DELETEME
    const db = firebase.firestore();
    const roomDocRef = db.collection("room").doc(roomId);
    await roomDocRef.update({ activeBoard: boardId });
  }

  /**
   * 入室リクエストの承認
   * @param userId
   * @return {Promise<boolean>}
   * @constructor
   */
  static async GrantRequest(userId: string) {
    console.log("Room.grantRequest", userId); // @DELETEME
    const room = store.getters["room/info"];
    if (room.requests.indexOf(userId) === -1) {
      throw new Error(`no request found: ${userId}`);
    }
    if (room.users.indexOf(userId) !== -1) {
      console.log(`already granted: ${userId}`); // @DELETEME
      return false;
    }
    const requests = room.requests.filter((id: string) => id !== userId);
    const users = room.users.slice();
    users.push(userId);

    const db = firebase.firestore();

    const roomDoc = db.collection("room").doc(room.id);
    await roomDoc.update({ requests, users });
    await FSUser.JoinRoom(userId, room.id);
  }

  /**
   * 入室済みユーザを退室させる
   * @param userId
   * @return {Promise<void>}
   * @constructor
   */
  static async DropUser(userId: string) {
    console.log("Room.dropUser", userId); // @DELETEME

    /* room.users からの削除 */
    const room = store.getters["room/info"];
    if (room.owner === userId) {
      throw new Error(`cannnot drop owner: ${userId}`);
    }
    const users = room.users.filter((u: string) => u !== userId);

    const db = firebase.firestore();
    const doc = db.collection("room").doc(room.id);
    await doc.update({ users });

    /* user.joinTo からの削除 */
    await FSUser.LeaveRoom(userId, room.id);
  }

  /**
   * ユーザの追放
   * @param userId
   * @return {Promise<void>}
   */
  static async KickUser(userId: string) {
    console.log("Room.kickUser", userId); // @DELETEME

    /* room.users, requests からの削除 + kicked への追加 */
    const room = store.getters["room/info"];
    if (room.owner === userId) {
      throw new Error("cannot kick owner");
    }
    const users = room.users.filter((u: string) => u !== userId);
    const requests = room.requests.filter((u: string) => u !== userId);

    const kicked = room.kicked.slice();
    if (room.kicked.indexOf(userId) === -1) {
      kicked.push(userId);
    }

    const db = firebase.firestore();
    const doc = db.collection("room").doc(room.id);
    await doc.update({ users, requests, kicked });

    /* user.joinTo からの削除 */
    await FSUser.LeaveRoom(userId, room.Id);
  }

  /**
   * 入室リクエストの作成
   * @param userId
   * @return {Promise<void>}
   */
  static async MakeRequest(userId: string) {
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

  static SetListener(roomId: string) {
    console.log("Room.SetListener"); // @DELETEME
    const db = firebase.firestore();
    const docRef = db.collection("room").doc(roomId);
    const unsubscribe = docRef.onSnapshot(doc => {
      const room = doc.data();

      store.dispatch("room/setRoom", { room: { id: roomId, ...room } });
    });
    FSRoom.unsubscribeMap.set(roomId, { id: roomId, unsubscribe });
  }

  static RemoveListener(roomId: string) {
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
