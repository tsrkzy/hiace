/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../util/firestore";
import { useCharacters } from "../store/characters";
import { Character } from "../Character";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function CharacterListener() {
  const { setCharacters } = useCharacters();

  const setCharacterListener = (roomId: string) => {
    console.log("setCharacterListener");
    const q = query(collection(db, "character"), where("room", "==", roomId));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const characters: Character[] = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        const character = new Character({
          id: doc.id,
          name: d.name,
          room: d.room,
          owner: d.owner,
          activeAlias: d.activeAlias,
          chatPosition: d.chatPosition,
          pawnSize: d.pawnSize,
          showOnInitiative: d.showOnInitiative,
          text: d.text,
          color: d.color,
          lastPostDatetime: d.lastPostDatetime,
        });
        characters.push(character);
      });
      setCharacters(characters);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setCharacterListener };
}
