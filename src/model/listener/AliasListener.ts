/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/util/firestore";
import { Alias } from "@/model/Alias";
import { useAliases } from "@/model/store/aliases";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function AliasListener() {
  const { setAliases } = useAliases();

  const setAliasListener = (roomId: string) => {
    console.log("setAliasListener");
    const q = query(collection(db, "alias"), where("room", "==", roomId));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const aliases: Alias[] = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        const alias = new Alias({
          id: doc.id,
          room: d.room,
          character: d.character,
          image: d.image,
          name: d.name,
        });
        aliases.push(alias);
      });
      setAliases(aliases);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setAliasListener };
}
