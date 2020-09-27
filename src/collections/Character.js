import store from "@/store";
import firebase from "firebase";

export const CHARACTER_NOT_SELECTED = null;

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
  static async Create(params = {}) {
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

    const c = {
      owner
      , name
      , room: roomId
      , text
      , activeAlias
      , showOnInitiative
      , baseStats
      , stats
    };

    const db = firebase.firestore();
    const characterDocRef = await db.collection("character").add(c);
    c.id = characterDocRef.id;

    return c;
  }

  static SetListener(roomId) {
    console.log("Character.SetListener", roomId); // @DELETEME

    const { unsubscribeMap } = FSCharacter;
    if (unsubscribeMap.has(roomId)) {
      FSCharacter.RemoveListener(roomId);
    }

    const db = firebase.firestore();
    const docsRef = db.collection("character")
      .where("room", "==", roomId);

    const unsubscribe = docsRef.onSnapshot((querySnapshot) => {
      const characters = [];
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

  static RemoveListener(roomId) {
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