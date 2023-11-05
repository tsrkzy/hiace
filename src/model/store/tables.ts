import { writable } from "svelte/store";
import { Table } from "../Table";

const tables = writable<Table[]>([]);

tables.subscribe(a => {
  console.log("tables.subscribe", a); // @DELETEME
});

export const useTables = () => {
  return {
    setTables: tables.set,
  };
};
