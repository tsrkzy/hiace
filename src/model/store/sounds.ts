import { writable } from "svelte/store";
import { Sound } from "../Sound";

const sounds = writable<Sound[]>([]);

sounds.subscribe(a => {
  console.log("sounds.subscribe", a); // @DELETEME
});

export const useSounds = () => {
  return {
    subscribeSounds: sounds.subscribe,
    setSounds: sounds.set,
  };
};
