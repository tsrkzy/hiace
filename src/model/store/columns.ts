import { writable } from "svelte/store";
import { Column } from "@/model/Column";

const columns = writable<Column[]>([]);

columns.subscribe(a => {
  console.log("columns.subscribe", a); // @DELETEME
});

export const useColumns = () => {
  return {
    setColumns: columns.set,
  };
};
