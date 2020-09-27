import store from "@/store";
import firebase from "firebase/app";
import "firebase/firestore";

export const SYSTEM_CHANNEL_ID = "SYSTEM";

export class FSChannel {
  static unsubscribeMap = new Map();

  static async Create({ type, name, room } = {}) {
    const c = {
      type,
      name,
      room
    };
    const db = firebase.firestore();
    const docRef = await db.collection("channel").add(c);
    c.id = docRef.id;

    return c;
  }

  static SetListener(roomId) {
    console.log("Channel.SetListener"); // @DELETEME
    const db = firebase.firestore();
    const docRef = db.collection("channel").where("room", "==", roomId);
    const unsubscribe = docRef.onSnapshot(querySnapshot => {
      const channels = [];
      querySnapshot.forEach(doc => {
        const channel = doc.data();
        channel.id = doc.id;
        channels.push(channel);
      });
      store.dispatch("channel/setChannels", { channels });
    });

    const { unsubscribeMap } = FSChannel;
    const listener = { id: roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener() {
    console.log("Channel.RemoveListener"); // @DELETEME
    const { unsubscribeMap } = FSChannel;
    const listeners = unsubscribeMap.values();
    for (const l of listeners) {
      const { id, unsubscribe } = l;
      unsubscribe?.();
      console.log(`unsubscribed: ${id}`); // @DELETEME
    }

    unsubscribeMap.clear();
  }
}
