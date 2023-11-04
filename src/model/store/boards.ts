import { derived, get, writable } from "svelte/store";
import { Board } from "../Board";
import { useRoom } from "./room";

const { room } = useRoom();

const boards = writable<Board[]>([]);

boards.subscribe(a => {
  console.log("boards.subscribe", a); // @DELETEME
});

const activeBoard = derived(boards, $boards => {
  return $boards.find(b => b.id === get(room).activeBoard);
});

export const useBoards = () => {
  return {
    subscribeBoards: boards.subscribe,
    setBoards: boards.set,
    boards,
    activeBoard,
  };
};
