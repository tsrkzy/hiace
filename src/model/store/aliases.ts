import { writable } from "svelte/store";
import { Alias } from "../Alias";

const aliases = writable<Alias[]>([]);

aliases.subscribe(a => {
  console.log("aliases.subscribe", a); // @DELETEME
});

export const useAliases = () => {
  return {
    setAliases: aliases.set,
    aliases,
  };
};
