import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import store from "@/store";
import { getName } from "@/scripts/helper";
import { SYSTEM_COLOR } from "@/collections/Chat";

export interface TabIF {
  user: string;
  tabId: string;
  room: string;
  createdAt: number;
}

export class FSUser {
  static unsubscribeMap = new Map();

  static Who(id: string) {
    return getName("user", id);
  }

  static async GetById({ id }: { id: string }) {
    if (!id) {
      return null;
    }
    const db = firebase.firestore();
    const docRef = await db
      .collection("user")
      .doc(id)
      .get();
    if (!docRef.exists) {
      return null;
    }
    const user = docRef.data();

    return { id, ...user };
  }

  static async GetByEmail({
    email
  }: {
    email: string;
  }): Promise<null | { id: string; email: string; photoURL: string | null }> {
    const db = firebase.firestore();
    const snapshot = await db
      .collection("user")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return null;
    }

    let result: any = null;
    snapshot.forEach(d => {
      result = d.data();
      result.id = d.id;
    });

    return result;
  }

  /** select&update or insert */
  static async Create() {
    const db = firebase.firestore();
    const me = firebase.auth().currentUser;

    /* 既に同じメールアドレスでユーザが作成されていたらアイコンURLだけ期限があるので更新 */
    const email: string = me?.email ?? "";
    const user = await FSUser.GetByEmail({ email });
    if (user) {
      await FSUser.Update(user.id, { photoUrl: me?.photoURL });
      user.photoURL = me?.photoURL ?? null;

      return user;
    }

    /* 新規作成 */
    const u = {
      sys: { created: Date.now() },
      name: me?.displayName,
      photoUrl: me?.photoURL,
      email: me?.email,
      lastPing: Date.now(),
      color: SYSTEM_COLOR,
      joinTo: []
    };
    const ref = await db.collection("user").add(u);
    const id = ref.id;

    return { id, ...u };
  }

  static async Update(id: string, criteria: object) {
    const db = firebase.firestore();
    const doc = db.collection("user").doc(id);
    return await doc.update(criteria);
  }

  static async Ping(id: string) {
    const db = firebase.firestore();
    const doc = db.collection("user").doc(id);
    return await doc.update({ lastPing: Date.now() });
  }

  static async JoinRoom(userId: string, roomId: string) {
    const db = firebase.firestore();
    const userDoc = db.collection("user").doc(userId);
    const userRef = await userDoc.get();
    const user = userRef.data();

    if (!user) {
      throw new Error(`no user found: ${userId} in room: ${roomId}`);
    }

    const { joinTo = [] } = user;
    if (joinTo.indexOf(roomId) !== -1) {
      console.log("already joined"); // @DELETEME
      return false;
    }
    joinTo.push(roomId);
    await userDoc.update({ joinTo });
  }

  static async LeaveRoom(userId: string, roomId: string) {
    const db = firebase.firestore();
    const userDoc = db.collection("user").doc(userId);
    const userRef = await userDoc.get();
    const user = userRef.data();

    if (!user) {
      throw new Error(`no user found: ${userId}`);
    }

    const { joinTo = [] } = user;
    if (joinTo.indexOf(roomId) === -1) {
      console.log("already left");
      return false;
    }

    joinTo.splice(joinTo.indexOf(userId), 1);

    await userDoc.update({ joinTo });
  }

  static SetListener(roomId: string) {
    console.log("User.SetListener"); // @DELETEME
    FSUser.RemoveListener();

    const db = firebase.firestore();
    const docsRef = db
      .collection("user")
      .where("joinTo", "array-contains", roomId);

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const users: any[] = [];
      querySnapshot.forEach(doc => {
        const user = doc.data();
        user.id = doc.id;
        users.push(user);
      });
      store.dispatch("user/setUsers", { users });
    });

    const { unsubscribeMap } = FSUser;
    const listener = { id: roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener() {
    console.log("User.RemoveListener"); // @DELETEME
    const { unsubscribeMap } = FSUser;
    const listeners = unsubscribeMap.values();
    for (const l of listeners) {
      const { id, unsubscribe } = l;
      unsubscribe?.();
      console.log(`unsubscribed: ${id}`); // @DELETEME
    }

    unsubscribeMap.clear();
  }
}
