import { FSAlias } from "@/collections/Alias";
import store from "@/store";
import firebase from "firebase/app";
import "firebase/firestore";
import { DEFAULT_CHARACTER_IMAGE } from "@/collections/Image";
import { FSPawn } from "@/collections/Pawn";
import { getName } from "@/scripts/helper";
import { SYSTEM_COLOR } from "@/collections/Chat";

export const CHARACTER_NOT_SELECTED = "CHARACTER_NOT_SELECTED";

type TCharacter = {
  id: string;
  activeAlias?: string;
};

export class FSCharacter {
  static unsubscribeMap = new Map();

  static Who(id: string) {
    return getName("character", id);
  }

  static async GetById({ id }: { id: string }): Promise<TCharacter | null> {
    const db = firebase.firestore();
    const docRef = await db
      .collection("character")
      .doc(id)
      .get();

    if (!docRef.exists) {
      return null;
    }
    const character = docRef.data();

    return { id, ...character };
  }

  static async Create(params: {
    owner: string;
    name: string;
    roomId: string;
    text: string;
    activeAlias: string;
    imageId: string;
    showOnInitiative: boolean;
    chatPosition: number;
    pawnSize: number;
    color: string;
  }) {
    const {
      owner,
      name,
      roomId,
      text = "",
      activeAlias = "alias_1",
      imageId = DEFAULT_CHARACTER_IMAGE,
      showOnInitiative = true,
      chatPosition = 1,
      pawnSize = 1,
      color = SYSTEM_COLOR
    } = params;

    if (!owner) {
      throw new Error("no owner given");
    }

    if (!roomId) {
      throw new Error("no roomId given");
    }

    const c = {
      owner,
      name,
      room: roomId,
      text,
      activeAlias,
      showOnInitiative,
      chatPosition,
      pawnSize,
      color
    };

    const db = firebase.firestore();
    const characterDocRef = await db.collection("character").add(c);
    const id = characterDocRef.id;

    /* 初期aliasを作成してactiveに指定 */
    const alias = await FSAlias.CreateDefault({
      roomId,
      characterId: id,
      imageId
    });
    await FSCharacter.SetActiveAlias(id, alias.id);

    return { id, ...c };
  }

  static async Update(characterId: string, criteria: object) {
    const db = firebase.firestore();
    const doc = db.collection("character").doc(characterId);
    return await doc.update(criteria);
  }

  static async UpdateLastPostDatetime(characterId: string, datetime?: number) {
    const lastPostDatetime = datetime ?? Date.now();
    await FSCharacter.Update(characterId, { lastPostDatetime });
  }

  static async Delete(characterId: string) {
    /* @FIXME CharacterはDeleteよりArchiveの方が良さそう？ */
    const db = firebase.firestore();
    const docRef = await db
      .collection("character")
      .doc(characterId)
      .delete();

    /* 紐づくAliasも削除 */
    await FSAlias.DeleteByCharacter(characterId);

    /* 紐づくPawnも削除 */
    await FSPawn.DeleteByCharacter(characterId);

    /* 紐づくChat？ */

    return docRef;
  }

  static async SetActiveAlias(characterId: string, aliasId: string) {
    const db = firebase.firestore();
    const characterDocRef = db.collection("character").doc(characterId);
    await characterDocRef.update({ activeAlias: aliasId });
  }

  static async GetAliasImage(characterId: string) {
    const character = await FSCharacter.GetById({ id: characterId });
    if (!character || !character.activeAlias) {
      return null;
    }
    const activeAlias = character.activeAlias;

    const alias = await FSAlias.GetById({ id: activeAlias });

    return alias?.image;
  }

  static SetListener(roomId: string) {
    console.log("Character.SetListener", roomId); // @DELETEME

    const { unsubscribeMap } = FSCharacter;
    if (unsubscribeMap.has(roomId)) {
      FSCharacter.RemoveListener(roomId);
    }

    const db = firebase.firestore();
    const docsRef = db.collection("character").where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot(querySnapshot => {
      const characters: any[] = [];
      querySnapshot.forEach(doc => {
        const character = doc.data();
        character.id = doc.id;
        characters.push(character);
      });
      store.dispatch("character/setCharacters", { characters });
    });
    const listener = { roomId, unsubscribe };
    unsubscribeMap.set(roomId, listener);
  }

  static RemoveListener(roomId: string) {
    const { unsubscribeMap } = FSCharacter;
    if (!unsubscribeMap.has(roomId)) {
      console.log("no listener found: ", roomId); // @DELETEME
      return false;
    }
    const listener = unsubscribeMap.get(roomId);
    listener.unsubscribe();

    unsubscribeMap.delete(roomId);
  }
}
