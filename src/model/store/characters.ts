import { writable } from "svelte/store";
import { Character } from "../Character";

const characters = writable<Character[]>([]);

characters.subscribe(a => {
  console.log("characters.subscribe", a); // @DELETEME
});

export const useCharacters = () => {
  return {
    subscribeCharacters: characters.subscribe,
    setCharacters: characters.set,
  };
};
