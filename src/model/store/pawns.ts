import { writable } from "svelte/store";
import { Pawn } from "../Pawn";

const pawns = writable<Pawn[]>([]);

pawns.subscribe(a => {
  console.log("pawns.subscribe", a); // @DELETEME
});

const draggedPawnId = writable<string>("");

export const usePawns = () => {
  return {
    setPawns: pawns.set,
    pawns,
    draggedPawnId,
    setDraggedPawnId: draggedPawnId.set,
  };
};
