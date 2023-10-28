/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../util/firestore";
import { Alias } from "../Alias";
import { useAliases } from "../store/alias";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function AliasListener() {
  const { setAliases } = useAliases();

  const setAliasListener = (roomId: string) => {
    console.log("setAliasListener");
    const q = query(collection(db, "alia"), where("room", "==", roomId));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const alias: Alias[] = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        const alia = new Alias({
          id: doc.id,
          name: d.name,
        });
        alias.push(alia);
      });
      setAliases(alias);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setAliasListener };
}
