import { writable } from "svelte/store";
import { Table } from "@/model/Table";
import { type CellEditorTarget } from "@/component/float/TableManager/tableTypes";

const tables = writable<Table[]>([]);
const showCellEditor = writable<boolean>(false);
const cellEditorX = writable<number>(0);
const cellEditorY = writable<number>(0);
const cellEditorTarget = writable<CellEditorTarget|null>(null);

tables.subscribe(a => {
  console.log("tables.subscribe", a); // @DELETEME
});
showCellEditor.subscribe(a => {
  console.log("tables.showCellEditor", a); // @DELETEME
});
cellEditorX.subscribe(a => {
  console.log("tables.cellEditorX", a);
})
cellEditorY.subscribe(a => {
  console.log("tables.cellEditorY", a);
})
cellEditorTarget.subscribe(a => {
  console.log("tables.cellEditorTarget", a);
})

export const useTables = () => {
  return {
    setTables: tables.set,
    tables,
    setShowCellEditor: showCellEditor.set,
    showCellEditor,
    setCellEditorX: cellEditorX.set,
    cellEditorX,
    setCellEditorY: cellEditorY.set,
    cellEditorY,
    setCellEditorTarget: cellEditorTarget.set,
    cellEditorTarget,
  };
};
