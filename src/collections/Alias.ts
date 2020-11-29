import store from "@/store";
import firebase from "firebase/app";
import "firebase/firestore";
import { DEFAULT_CHARACTER_IMAGE } from "@/collections/Image";

export const ALIAS_NOT_SELECTED = "ALIAS_NOT_SELECTED";

type TAlias = {
  id: string;
  image?: string;
};

export class FSAlias {
  static unsubscribeMap = new Map();

  static async GetById({ id }: { id: string }): Promise<TAlias | null> {
    const db = firebase.firestore();
    const docRef = await db
      .collection("alias")
      .doc(id)
      .get();
    if (!docRef.exists) {
      return null;
    }
    const alias = docRef.data();
    return { id, ...alias };
  }

  static async Create(params: {
    roomId: string;
    characterId: string;
    imageId: string | null;
    name: string;
  }) {
    const {
      roomId: room,
      characterId: character,
      imageId: image = DEFAULT_CHARACTER_IMAGE,
      name
    } = params;

    const alias = {
      room,
      character,
      image,
      name
    };
    const db = firebase.firestore();
    const docRef = await db.collection("alias").add(alias);
    const id = docRef.id;

    return { id, ...alias };
  }

  static async CreateDefault(params: {
    roomId: string;
    characterId: string;
    imageId: string;
  }) {
    const { roomId, characterId, imageId } = params;
    const name = "基本";
    return await FSAlias.Create({
      roomId,
      characterId,
      imageId,
      name
    });
  }

  static async DeleteByCharacter(characterId: string) {
    const db = firebase.firestore();
    const querySnapshot = await db
      .collection("alias")
      .where("character", "==", characterId)
      .get();

    const batch = db.batch();
    querySnapshot.forEach(doc => batch.delete(doc.ref));

    await batch.commit();
  }

  static async SetImageId(aliasId: string, imageId: string) {
    const db = firebase.firestore();
    const aliasDocRef = db.collection("alias").doc(aliasId);
    await aliasDocRef.update({ imageId });
  }

  static SetListener(roomId: string) {
    console.log("Alias.SetListener", roomId); // @DELETEME

    const { unsubscribeMap } = FSAlias;
    if (unsubscribeMap.has(roomId)) {
      FSAlias.RemoveListener(roomId);
    }

    const db = firebase.firestore();
    const docsRef = db.collection("alias").where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const aliases: any[] = [];
      querySnapshot.forEach(doc => {
        const alias = doc.data();
        alias.id = doc.id;
        aliases.push(alias);
      });
      store.dispatch("alias/setAliases", { aliases });
    });
    const listener = { roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener(roomId: string) {
    const { unsubscribeMap } = FSAlias;
    if (!unsubscribeMap.has(roomId)) {
      console.log("no listener found: ", roomId); // @DELETEME
      return false;
    }
    const listener = unsubscribeMap.get(roomId);
    listener.unsubscribe();

    unsubscribeMap.delete(roomId);
  }
}
