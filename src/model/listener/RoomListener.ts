/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/util/firestore";
import { useRoom } from "@/model/store/room";
import { Room } from "@/model/Room";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function RoomListener() {
  const { setRoom } = useRoom();
  const setRoomListener = (roomId: string) => {
    console.log("setRoomListener");
    const unsubscribe = onSnapshot(doc(db, "room", roomId), doc => {
      const d = doc.data();
      if (!d) {
        throw new Error("cannot get document");
      }
      setRoom(
        new Room({
          id: doc.id,
          name: d.name,
          owner: d.owner,
          keepers: d.keepers,
          requests: d.requests,
          kicked: d.kicked,
          users: d.users,
          activeBoard: d.activeBoard,
          gameSystem: d.gameSystem,
          music: d.music,
        }),
      );
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };
  const removeListener = () => {
    const subscribes = Array.from(subscribeMap.values());
    for (let i = 0; i < subscribes.length; i++) {
      const { id, unsubscribe } = subscribes[i];
      unsubscribe?.();
      console.log(`unsubscribed: ${id}`);
    }
  };

  return { setRoomListener, removeListener };
}
