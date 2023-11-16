/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/util/firestore";
import { useChannels } from "@/model/store/channels";
import { Channel } from "@/model/Channel";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function ChannelListener() {
  const { setChannels } = useChannels();

  const setChannelListener = (roomId: string) => {
    console.log("setChannelListener");
    const q = query(collection(db, "channel"), where("room", "==", roomId));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const channels: Channel[] = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        const channel = new Channel({
          id: doc.id,
          name: d.name,
          room: d.room,
        });
        channels.push(channel);
      });
      setChannels(channels);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setChannelListener };
}
