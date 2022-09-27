import store from "@/store";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

type TPhrase = {
  id: string;
  owner: string;
  index: number;
  text: string;
  label: string;
  ok: boolean;
};

export class FSPhrase {
  static unsubscribeMap = new Map();

  static async GetById({ id }: { id: string }): Promise<TPhrase | null> {
    const db = firebase.firestore();
    const docRef = await db.collection("phrase").doc(id).get();

    const phrase = docRef.data();
    if (!phrase) {
      return null;
    }

    return {
      id,
      owner: phrase.owner,
      index: phrase.index,
      text: phrase.text,
      label: phrase.label,
      ok: phrase.ok,
    };
  }

  static async Create(params: {
    text: string;
    label: string | null;
    ok?: boolean;
  }) {
    const { text, label = "", ok = false } = params;

    const indexList = store.getters["phrase/info"].map(
      (p: { index: number }) => p.index
    );
    const max = Math.max(...indexList, -1);
    const owner = store.getters["auth/user"].id;
    const gameSystem = store.getters["room/gameSystem"];
    const p = {
      index: max + 1,
      owner,
      text,
      label,
      gameSystem,
      ok,
    };
    const db = firebase.firestore();
    const docRef = await db.collection("phrase").add(p);
    const id = docRef.id;

    return { id, ...p };
  }

  static async Duplicate(phraseId: string) {
    const phrase = await FSPhrase.GetById({ id: phraseId });
    if (!phrase) {
      throw new Error(`phrase not found: ${phraseId}`);
    }

    return await FSPhrase.Create(phrase);
  }

  static async Swap(
    pA: { id: string; index: number },
    pB: { id: string; index: number }
  ) {
    const indexA = pA.index;
    const indexB = pB.index;
    const idA = pA.id;
    const idB = pB.id;

    const db = firebase.firestore();
    const refA = db.collection("phrase").doc(idA);
    const refB = db.collection("phrase").doc(idB);

    const b = db.batch();
    b.update(refA, { index: indexB });
    b.update(refB, { index: indexA });
    await b.commit();
  }

  static async Update(phraseId: string, criteria: object) {
    const db = firebase.firestore();
    const doc = db.collection("phrase").doc(phraseId);
    return await doc.update(criteria);
  }

  static async Delete(phraseId: string) {
    const db = firebase.firestore();
    return db.collection("phrase").doc(phraseId).delete();
  }

  static SetListener(userId: string) {
    console.log("Phrase.SetListener", userId); // @DELETEME

    const { unsubscribeMap } = FSPhrase;
    if (unsubscribeMap.has(userId)) {
      FSPhrase.RemoveListener(userId);
    }

    const db = firebase.firestore();
    const docsRef = db.collection("phrase").where("owner", "==", userId);

    const unsubscribe = docsRef.onSnapshot((querySnapshot) => {
      const phrases: any[] = [];
      querySnapshot.forEach((doc) => {
        const phrase = doc.data();
        phrase.id = doc.id;
        phrases.push(phrase);
      });
      store.dispatch("phrase/setPhrases", { phrases });
    });
    const listener = { userId, unsubscribe };
    unsubscribeMap.set(userId, listener);
  }

  static RemoveListener(userId: string) {
    const { unsubscribeMap } = FSPhrase;
    if (!unsubscribeMap.has(userId)) {
      console.log("no listener found: ", userId); // @DELETEME
      return false;
    }
    const listener = unsubscribeMap.get(userId);
    listener.unsubscribe();

    unsubscribeMap.delete(userId);
  }
}
