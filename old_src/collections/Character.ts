import { FSAlias } from "@/collections/Alias";
import store from "@/store";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { FSPawn } from "@/collections/Pawn";
import { getName, postfix } from "@/scripts/helper";
import { SYSTEM_COLOR } from "@/collections/Chat";

export const CHARACTER_NOT_SELECTED = "CHARACTER_NOT_SELECTED";

type TCharacter = {
  id: string;
  owner?: string;
  name?: string;
  room?: string;
  text?: string;
  showOnInitiative?: boolean;
  chatPosition?: number;
  pawnSize?: number;
  color?: string;
  archived?: boolean;
  activeAlias?: string;
};

export class FSCharacter {
  static unsubscribeMap = new Map();

  static Who(id: string) {
    return getName("character", id);
  }

  static async GetById({ id }: { id: string }): Promise<TCharacter | null> {
    const db = firebase.firestore();
    const docRef = await db.collection("character").doc(id).get();

    const character = docRef.data();
    if (!character) {
      return null;
    }

    return {
      id,
      owner: character.owner,
      name: character.name,
      room: character.room,
      text: character.text,
      showOnInitiative: character.showOnInitiative,
      chatPosition: character.chatPosition,
      pawnSize: character.pawnSize,
      color: character.color,
      archived: character.archived,
      activeAlias: character.activeAlias,
    };
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
    archived: boolean;
  }) {
    const character = await FSCharacter.CreateOrphan({
      owner: params.owner,
      name: params.name,
      room: params.roomId,
      text: params.text ?? "",
      activeAlias: params.activeAlias,
      showOnInitiative: params.showOnInitiative ?? true,
      chatPosition: params.chatPosition ?? 0,
      pawnSize: params.pawnSize ?? 1,
      color: params.color ?? SYSTEM_COLOR,
      archived: params.archived ?? false,
    });
    const id = character.id;

    /* 初期aliasを作成してactiveに指定 */
    const alias = await FSAlias.CreateDefault({
      roomId: params.roomId,
      characterId: id,
      imageId: params.imageId,
    });
    await FSCharacter.SetActiveAlias(id, alias.id);

    return character;
  }

  static async CreateOrphan(params: {
    owner: string;
    name: string;
    room: string;
    text: string;
    activeAlias: string | null;
    showOnInitiative: boolean;
    chatPosition: number;
    pawnSize: number;
    color: string;
    archived: boolean;
  }) {
    const {
      owner,
      name,
      room,
      text,
      activeAlias = null,
      showOnInitiative = true,
      chatPosition = 0,
      pawnSize = 1,
      color = SYSTEM_COLOR,
      archived = false,
    } = params;

    if (!owner) {
      throw new Error("no owner given");
    }

    if (!room) {
      throw new Error("no room given");
    }
    const c = {
      owner,
      name,
      room,
      text,
      activeAlias,
      showOnInitiative,
      chatPosition,
      pawnSize,
      color,
      archived,
    };
    const db = firebase.firestore();
    const characterDocRef = await db.collection("character").add(c);
    const id = characterDocRef.id;
    return { id, ...c };
  }

  static async Duplicate(characterId: string) {
    const c = store.getters["character/info"].find(
      (c: { id: string }) => c.id === characterId
    );
    if (!c) {
      throw new Error(`no character found: ${characterId}`);
    }
    const {
      owner,
      name,
      room,
      text,
      showOnInitiative,
      chatPosition,
      pawnSize,
      color,
      archived,
      activeAlias,
    } = c;

    const me = store.getters["auth/user"].id;
    const newCharacter = await FSCharacter.CreateOrphan({
      owner: me,
      name: postfix(name),
      room,
      text,
      activeAlias: null,
      showOnInitiative,
      chatPosition,
      pawnSize,
      color,
      archived,
    });
    const newCharacterId = newCharacter.id;

    const aList = store.getters["alias/info"].filter(
      (a: { character: string }) => a.character === characterId
    );
    for (let i = 0; i < aList.length; i++) {
      const a = aList[i];
      const newAlias = await FSAlias.Create({
        roomId: room,
        characterId: newCharacterId,
        imageId: a.image,
        name: a.name,
      });
      if (a.id === activeAlias) {
        await FSCharacter.SetActiveAlias(newCharacterId, newAlias.id);
      }
    }

    return newCharacter;
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
    const db = firebase.firestore();
    const docRef = await db.collection("character").doc(characterId).delete();

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

    const unsubscribe = docsRef.onSnapshot((querySnapshot) => {
      const characters: any[] = [];
      querySnapshot.forEach((doc) => {
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
