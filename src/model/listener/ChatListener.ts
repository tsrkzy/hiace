/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../util/firestore";
import { useChats } from "../store/chats";
import { Chat } from "../Chat";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function ChatListener() {
  const { setChats } = useChats();

  const setChatListener = (roomId: string) => {
    console.log("setChatListener");
    const q = query(collection(db, "chat"), where("room", "==", roomId));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const chats: Chat[] = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        const chat = new Chat({
          id: doc.id,
          name: d.name,
        });
        chats.push(chat);
      });
      setChats(chats);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setChatListener };
}
