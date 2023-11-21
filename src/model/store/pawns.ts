import { writable } from "svelte/store";
import { Pawn } from "@/model/Pawn";

const pawns = writable<Pawn[]>([]);

pawns.subscribe(a => {
  console.log("pawns.subscribe", a); // @DELETEME
});

const draggedPawnId = writable<string>("");
const pawnDescriptionText = writable<string>("");
const pawnDescriptionSide = writable<"left" | "right">("left");

export const usePawns = () => {
  return {
    setPawns: pawns.set,
    pawns,
    draggedPawnId,
    setDraggedPawnId: draggedPawnId.set,
    pawnDescriptionText,
    setPawnDescriptionText: pawnDescriptionText.set,
    pawnDescriptionSide,
    setPawnDescriptionSide: pawnDescriptionSide.set,
  };
};
