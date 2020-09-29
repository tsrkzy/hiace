import { SYSTEM_CHANNEL_ID } from "@/collections/Channel";
import firebase from "firebase/app";
import "firebase/firestore";
import store from "@/store";

export class FSChat {
  static unsubscribeMap = new Map();

  static async Create({
    type,
    room,
    channel,
    owner,
    character,
    alias,
    value = {}
  }) {
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
    c.id = chatDocRef.id;

    return c;
  }

  static async BroadcastLoggedIn({ roomId, user }) {
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

  static SetListener(roomId) {
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
      const chats = [];
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

  static RemoveListener(roomId) {
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
