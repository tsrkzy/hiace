import { writable } from "svelte/store";
import { Pawn } from "../Pawn";

const pawns = writable<Pawn[]>([]);

pawns.subscribe(a => {
  console.log("pawns.subscribe", a); // @DELETEME
});

export const usePawns = () => {
  return {
    subscribePawns: pawns.subscribe,
    setPawns: pawns.set,
  };
};
