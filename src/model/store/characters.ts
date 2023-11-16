import { derived, writable, get } from "svelte/store";
import { Character } from "@/model/Character";
import { useUsers } from "./users";

const { myUserId } = useUsers();

const characters = writable<Character[]>([]);

characters.subscribe(a => {
  console.log("characters.subscribe", a); // @DELETEME
});

const myCharacters = derived(characters, $characters => {
  return $characters.filter(c => c.owner === get(myUserId));
});
export const useCharacters = () => {
  return {
    setCharacters: characters.set,
    characters,
    myCharacters,
  };
};
