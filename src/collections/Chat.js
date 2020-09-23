import firebase from "firebase/app";
import "firebase/firestore";
import store from "@/store";

export class FSChat {
  static unsubscribeMap = new Map();

  static async Create({ type, room, owner, character, value = {} }) {
    const db = firebase.firestore();

    const c = {
      type, room,
      owner, character, value
    };
    const chatDocRef = await db.collection("chat").add(c);
    c.id = chatDocRef.id;

    return c;
  }

  static SetListener(roomId) {
    console.log("Chat.SetListener", roomId); // @DELETEME

    const { unsubscribeMap } = FSChat;
    if (unsubscribeMap.has(roomId)) {
      FSChat.RemoveListener(roomId)
    }

    const db = firebase.firestore();
    const docsRef = db.collection("chat").where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot((querySnapshot) => {
      const chats = [];
      querySnapshot.forEach((doc) => {
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