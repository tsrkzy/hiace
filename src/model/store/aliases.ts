import { writable, get, derived } from "svelte/store";
import { Alias } from "../Alias";
import { useUsers } from "./users";

const { myUserId } = useUsers();

const aliases = writable<Alias[]>([]);

aliases.subscribe(a => {
  console.log("aliases.subscribe", a); // @DELETEME
});

const myAliases = derived(aliases, $aliases => {
  return $aliases.filter(a => a.owner === get(myUserId));
});

export const useAliases = () => {
  return {
    subscribeAliases: aliases.subscribe,
    setAliases: aliases.set,
    aliases,
    myAliases,
  };
};
