import { writable } from "svelte/store";
import { Column } from "../Column";

const columns = writable<Column[]>([]);

columns.subscribe(a => {
  console.log("columns.subscribe", a); // @DELETEME
});

export const useColumns = () => {
  return {
    subscribeColumns: columns.subscribe,
    setColumns: columns.set,
  };
};
