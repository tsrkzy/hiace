import { FSAlias } from "@/collections/Alias";
import store from "@/store";
import firebase from "firebase/app";
import "firebase/firestore";

export const CHARACTER_NOT_SELECTED = "CHARACTER_NOT_SELECTED";

export class FSCharacter {
  static unsubscribeMap = new Map();

  /*
   character_1: {
   sys: { version: 1.0, created: "ISO8601" },
   owner: "user_1", // 作成時に固定
   pawns: ["pawn_1", "pawn_2"], // character:pawn=1:n
   name: "夜神月",
   text: "",
   activeAlias: "alias_1",
   aliases: ["alias_1", "alias_2"],
   showOnInitiative: true,
   baseStats: [
   { key: "index", type: "number", value: 0 },
   { key: "initiative", type: "number", value: 0 },
   ],
   stats: [
   { key: "hp", type: "number", value: 10, max: 20 },
   { key: "stun", type: "boolean", value: false },
   ],
   }
   */
  static async Create(params: {
    owner: string;
    name: string;
    roomId: string;
    text: string;
    activeAlias: string;
    showOnInitiative: boolean;
    baseStats: string[];
    stats: string[];
  }) {
    const {
      owner,
      name,
      roomId,
      text = "",
      activeAlias = "alias_1",
      showOnInitiative = true,
      baseStats = [],
      stats = []
    } = params;

    if (!owner) {
      throw new Error("no owner given");
    }

    if (!roomId) {
      throw new Error("no owner roomId");
    }

    const c = {
      owner,
      name,
      room: roomId,
      text,
      activeAlias,
      showOnInitiative,
      baseStats,
      stats
    };

    const db = firebase.firestore();
    const characterDocRef = await db.collection("character").add(c);
    const id = characterDocRef.id;

    /* 初期aliasを作成してactiveに指定 */
    const alias = await FSAlias.CreateDefault({ roomId, characterId: id });
    await FSCharacter.SetActiveAlias(id, alias.id);

    return { id, ...c };
  }

  static async SetActiveAlias(characterId: string, aliasId: string) {
    const db = firebase.firestore();
    const characterDocRef = db.collection("character").doc(characterId);
    await characterDocRef.update({ activeAlias: aliasId });
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
