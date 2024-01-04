import { derived, get, writable } from "svelte/store";
import { Board } from "@/model/Board";
import { useRoom } from "@/model/store/room";

const { room } = useRoom();

const boards = writable<Board[]>([]);

boards.subscribe(a => {
  console.log("boards.subscribe", a); // @DELETEME
});

const activeBoard = derived(boards, $boards => {
  return $boards.find(b => b.id === get(room).activeBoard);
});

const draggedBoardId = writable<string>("");
const transform = writable<DOMMatrix>(new DOMMatrix());

export const useBoards = () => {
  return {
    setBoards: boards.set,
    boards,
    activeBoard,
    draggedBoardId,
    setDraggedBoardId: draggedBoardId.set,
    transform,
    setTransform: transform.set,
  };
};
