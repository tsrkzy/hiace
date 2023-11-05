/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../util/firestore";
import { usePawns } from "../store/pawns";
import { Pawn } from "../Pawn";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function PawnListener() {
  const { setPawns } = usePawns();

  const setPawnListener = (roomId: string) => {
    console.log("setPawnListener");
    const q = query(
      collection(db, "pawn"),
      where("room", "==", roomId),
      orderBy("updatedAt", "desc"),
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const pawns: Pawn[] = [];
      querySnapshot.forEach(doc => {
        const d = doc.data() as Pawn;
        const pawn = new Pawn({
          id: doc.id,
          room: d.room,
          owner: d.owner,
          board: d.board,
          image: d.image,
          character: d.character,
          transform: d.transform,
        });

        /* コンポーネントのmap機能がvueと逆なので、重ね順序をここで入れ替える */
        pawns.unshift(pawn);
      });
      setPawns(pawns);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setPawnListener };
}
