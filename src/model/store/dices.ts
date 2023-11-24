import { writable } from "svelte/store";
import { Dice } from "@/model/Dice";

const dices = writable<Dice[]>([]);

dices.subscribe(a => {
  console.log("dices.subscribe", a); // @DELETEME
});

const draggedDiceId = writable<string>("");

export const useDices = () => {
  return {
    setDices: dices.set,
    dices,
    draggedDiceId,
    setDraggedDiceId: draggedDiceId.set,
  };
};
