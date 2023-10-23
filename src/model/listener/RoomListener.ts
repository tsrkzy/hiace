/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../util/firestore";
import { useRoom } from "../../store/room";
import { RoomStore } from "../store/RoomStore";

const subscribeMap = new Map();

export function RoomListener() {
  const { setRoom } = useRoom()
  const setRoomListener = (roomId) => {
    console.log("setRoomListener");
    const unsubscribe =
      onSnapshot(doc(db, "room", roomId), (doc) => {
        const d = doc.data();
        console.log("Current data: ", d);
        setRoom(new RoomStore({
          id: doc.id,
          name: d.name,
          owner: d.owner,
          keepers: d.keepers,
          requests: d.requests,
          kicked: d.kicked,
          users: d.users,
          gameSystem: d.gameSystem,
          music: d.music,
        }))
      });

    subscribeMap.set(roomId, { id: roomId, unsubscribe })
  }
  const removeListener = () => {
    const subscribes = subscribeMap.values();
    for (let i = 0; i < subscribes.length; i++) {
      const { id, unsubscribe } = subscribes[i];
      unsubscribe?.();
      console.log(`unsubscribed: ${id}`);

    }
  }

  return { setRoomListener, removeListener }
}