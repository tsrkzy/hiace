import { writable } from "svelte/store";
import { Dice } from "@/model/Dice";

const dices = writable<Dice[]>([]);

dices.subscribe(a => {
  console.log("dices.subscribe", a); // @DELETEME
});

export const useDices = () => {
  return {
    setDices: dices.set,
  };
};
