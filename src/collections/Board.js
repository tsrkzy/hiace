import { FSMap } from "@/collections/Map";
import store from "@/store";
import firebase from "firebase/app";
import "firebase/firestore";

export class FSBoard {
  static unsubscribeMap = new Map();

  static async Create(params) {
    const { roomId, userId } = params;
    const m = {
      room: roomId,
      owner: userId
    };

    const db = firebase.firestore();
    const docRef = await db.collection("board").add(m);
    m.id = docRef.id;
    return m;
  }

  static async CreateDefault(params) {
    const { roomId, userId } = params;
    const b = await FSBoard.Create({ roomId, userId });
    await FSMap.CreateDefault({ roomId, userId, boardId: b.id });
    return b;
  }

  static async Delete(boardId) {
    const db = firebase.firestore();
    const docRef = await db
      .collection("board")
      .doc(boardId)
      .delete();

    /* 紐づくMapも削除 */
    await FSMap.DeleteByBoard(boardId);

    return docRef;
  }

  static SetListener(roomId) {
    console.log("Board.SetListener"); // @DELETEME
    FSBoard.RemoveListener();

    const db = firebase.firestore();
    const docsRef = db.collection("board").where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const boards = [];
      querySnapshot.forEach(doc => {
        const board = doc.data();
        board.id = doc.id;
        boards.push(board);
      });
      store.dispatch("board/setBoards", { boards });
    });

    const { unsubscribeMap } = FSBoard;
    const listener = { id: roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener() {
    console.log("Board.RemoveListener"); // @DELETEME
    const { unsubscribeMap } = FSBoard;
    const listeners = unsubscribeMap.values();
    for (const l of listeners) {
      const { id, unsubscribe } = l;
      unsubscribe?.();
      console.log(`unsubscribed: ${id}`); // @DELETEME
    }

    unsubscribeMap.clear();
  }
}
