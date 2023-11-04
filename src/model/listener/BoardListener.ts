/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../util/firestore";
import { useBoards } from "../store/boards";
import { Board } from "../Board";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function BoardListener() {
  const { setBoards } = useBoards();

  const setBoardListener = (roomId: string) => {
    console.log("setBoardListener");
    const q = query(collection(db, "board"), where("room", "==", roomId));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const boards: Board[] = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        const board = new Board({
          id: doc.id,
          room: d.room,
          owner: d.user,
        });
        boards.push(board);
      });
      setBoards(boards);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setBoardListener };
}
