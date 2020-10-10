import { SYSTEM_CHANNEL_ID } from "@/collections/Channel";
import firebase from "firebase/app";
import "firebase/firestore";
import store from "@/store";

export class FSChat {
  static unsubscribeMap = new Map();

  static async Create(params: {
    type: string;
    room: string;
    channel: string;
    owner: string;
    character: string | null;
    alias: string | null;
    value: any;
  }) {
    const {
      type,
      room,
      channel,
      owner,
      character = null,
      alias = null,
      value = {}
    } = params;

    if (!room) {
      console.error(room);
      throw new Error("no roomId given");
    }

    const db = firebase.firestore();
    const timestamp = Date.now();

    const c = {
      type,
      room,
      channel,
      owner,
      character,
      alias,
      value,
      timestamp
    };
    const chatDocRef = await db.collection("chat").add(c);
    const id = chatDocRef.id;
    return { id, ...c };
  }

  static async BroadcastLoggedIn({
    roomId,
    user
  }: {
    roomId: string;
    user: { id: string; email: string };
  }) {
    const { id: userId, email } = user;
    const c = {
      type: "system",
      room: roomId,
      channel: SYSTEM_CHANNEL_ID,
      owner: userId,
      character: null,
      alias: null,
      value: { text: `logged in - - - ${email} - - -` }
    };
    return await FSChat.Create(c);
  }

  static SetListener(roomId: string) {
    console.log("Chat.SetListener", roomId); // @DELETEME

    const { unsubscribeMap } = FSChat;
    if (unsubscribeMap.has(roomId)) {
      FSChat.RemoveListener(roomId);
    }

    const db = firebase.firestore();
    const docsRef = db
      .collection("chat")
      .where("room", "==", roomId)
      .orderBy("timestamp", "desc");

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const chats: any[] = [];
      querySnapshot.forEach(doc => {
        const chat = doc.data();
        chat.id = doc.id;
        chats.push(chat);
      });
      store.dispatch("chat/setChats", { chats });
    });
    const listener = { roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener(roomId: string) {
    const { unsubscribeMap } = FSChat;
    if (!unsubscribeMap.has(roomId)) {
      console.log("no listener found: ", roomId); // @DELETEME
      return false;
    }
    const listener = unsubscribeMap.get(roomId);
    listener.unsubscribe();

    unsubscribeMap.delete(roomId);
  }
}
