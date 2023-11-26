import { writable } from "svelte/store";
import { Table } from "@/model/Table";

const tables = writable<Table[]>([]);
const showTableEditor = writable<boolean>(false);

tables.subscribe(a => {
  console.log("tables.subscribe", a); // @DELETEME
});
showTableEditor.subscribe(a => {
  console.log("tables.showTableEditor", a); // @DELETEME
});

export const useTables = () => {
  return {
    setTables: tables.set,
    tables,
    setShowTableEditor: showTableEditor.set,
    showTableEditor
  };
};
