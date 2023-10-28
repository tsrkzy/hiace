import { writable } from "svelte/store";
import { Board } from "../Board";

const boards = writable<Board[]>([]);

boards.subscribe(a => {
  console.log("boards.subscribe", a); // @DELETEME
});

export const useBoards = () => {
  return {
    subscribeBoards: boards.subscribe,
    setBoards: boards.set,
  };
};
