import store from "@/store";
import firebase from "firebase/app";
import "firebase/firestore";
import { getName } from "@/scripts/helper";

/* chat.channelのnull大体 */
export const SYSTEM_CHANNEL_ID = "SYSTEM";
/** @deprecated */
export const SYSTEM_CHANNEL_TYPE = "SYSTEM_CHANNEL_TYPE";

export class FSChannel {
  static unsubscribeMap = new Map();

  static Who(id: string) {
    return getName("channel", id);
  }

  static async Create(params: {
    type: string | null;
    name: string | null;
    room: string;
  }) {
    const { type = null, name = null, room } = params;

    if (!room) {
      throw new Error("no room given");
    }
    const c = {
      type,
      name,
      room
    };
    const db = firebase.firestore();
    const docRef = await db.collection("channel").add(c);
    const id = docRef.id;

    return { id, ...c };
  }

  static async Update(channelId: string, criteria: object) {
    const db = firebase.firestore();
    const doc = db.collection("channel").doc(channelId);
    return await doc.update(criteria);
  }

  static async Delete(channelId: string) {
    const db = firebase.firestore();
    return db
      .collection("channel")
      .doc(channelId)
      .delete();
  }

  static SetListener(roomId: string) {
    console.log("Channel.SetListener"); // @DELETEME
    const db = firebase.firestore();
    const docRef = db.collection("channel").where("room", "==", roomId);
    const unsubscribe = docRef.onSnapshot(querySnapshot => {
      const channels: any[] = [];
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
