import { FSMap } from "@/collections/Map";
import { FSPawn } from "@/collections/Pawn";
import store from "@/store";
import firebase from "firebase/app";
import "firebase/firestore";
import { FSDice } from "@/collections/Dice";

export class FSBoard {
  static unsubscribeMap = new Map();

  static async Create(params: { roomId: string; userId: string }) {
    const { roomId, userId } = params;
    const m = {
      room: roomId,
      owner: userId
    };

    if (!roomId) {
      throw new Error("no roomId given");
    }

    if (!userId) {
      throw new Error("no userId given");
    }
    const db = firebase.firestore();
    const docRef = await db.collection("board").add(m);
    const id = docRef.id;
    return { id, ...m };
  }

  static async CreateDefault(params: { roomId: string; userId: string }) {
    const { roomId, userId } = params;
    const b = await FSBoard.Create({ roomId, userId });
    await FSMap.CreateDefault({ roomId, userId, boardId: b.id });
    return b;
  }

  static async Delete(boardId: string) {
    const activeBoard = store.getters["board/active"];
    if (boardId === activeBoard) {
      console.warn("cannot delete active board"); // @DELETEME
      return null;
    }

    const db = firebase.firestore();
    const docRef = await db
      .collection("board")
      .doc(boardId)
      .delete();

    /* 紐づくMapも削除 */
    await FSMap.DeleteByBoard(boardId);

    /* 紐づくPawnも削除 */
    await FSPawn.DeleteByBoard(boardId);

    /* 紐づくDiceも削除 */
    await FSDice.DeleteByBoard(boardId);

    return docRef;
  }

  static SetListener(roomId: string) {
    console.log("Board.SetListener"); // @DELETEME
    FSBoard.RemoveListener();

    const db = firebase.firestore();
    const docsRef = db.collection("board").where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const boards: any[] = [];
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
