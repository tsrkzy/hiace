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
import { Chat, ChatTypes } from "@/model/Chat";
import { chatBell } from "@/util/chatBell";
import { get } from "svelte/store";
import { diceBell } from "@/util/diceBell";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function ChatListener() {
  const { setChats, chats: _chats } = useChats();

  const setChatListener = (roomId: string) => {
    console.log("setChatListener");
    const q = query(
      collection(db, "chat"),
      where("room", "==", roomId),
      orderBy("timestamp", "asc"),
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const changes = querySnapshot.docChanges();

      const chats: Chat[] = [];
      if (changes.length !== 1 && changes.every(c => c.type === "added")) {
        console.log("first read");
        // 初回ロード時
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
      } else if (changes.length === 1 && changes[0].type === "added") {
        // チャット追加時
        const doc = changes[0].doc;
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
        const cccc = get(_chats);
        chats.push(...cccc, chat);
        if (chat.type === ChatTypes.TEXT) {
          chatBell();
        } else if (chat.type === ChatTypes.DICE) {
          diceBell();
        }
      } else {
        // それ以外のケースは起こり得ない想定のためエラーにする
        console.error(changes);
        throw new Error(
          "ChatListener.onSnapshot: 不正なケースが発生しました。",
        );
      }

      setChats(chats);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setChatListener };
}
