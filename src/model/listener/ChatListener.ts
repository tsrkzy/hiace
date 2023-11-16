/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/util/firestore";
import { useChats } from "@/model/store/chats";
import { Chat } from "@/model/Chat";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function ChatListener() {
  const { setChats } = useChats();

  const setChatListener = (roomId: string) => {
    console.log("setChatListener");
    const q = query(
      collection(db, "chat"),
      where("room", "==", roomId),
      orderBy("timestamp", "asc"), // @TODO should be "asc"
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const chats: Chat[] = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        const chat = new Chat({
          id: doc.id,
          room: d.room,
          channel: d.channel,
          alias: d.alias,
          character: d.character,
          color: d.color,
          owner: d.owner,
          type: d.type,
          value: d.value,
          timestamp: d.timestamp,
        });
        chats.push(chat);
      });
      setChats(chats);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setChatListener };
}
