import { writable } from "svelte/store";
import { ContextMenuItem } from "@/model/ContextMenu";

const contextMenuItems = writable<ContextMenuItem[]>([]);
const showContextMenu = writable<boolean>(false);
const contextMenuX = writable<number>(0);
const contextMenuY = writable<number>(0);
const contextMenuId = writable<string>("");

contextMenuItems.subscribe(a => {
  console.log("contextMenuItems.subscribe", a);
});
showContextMenu.subscribe(a => {
  console.log("contextMenu.showContextMenu", a);
})
contextMenuX.subscribe(a => {
  console.log("contextMenu.contextMenuX", a);
})
contextMenuY.subscribe(a => {
  console.log("contextMenu.contextMenuY", a);
})
contextMenuId.subscribe(a => {
  console.log("contextMenu.contextMenuId", a);
})

export const useContextMenu = () => ({
  setContextMenuItems: contextMenuItems.set,
  contextMenuItems,
  setShowContextMenu: showContextMenu.set,
  showContextMenu,
  setContextMenuX: contextMenuX.set,
  contextMenuX,
  setContextMenuY: contextMenuY.set,
  contextMenuY,
  setContextMenuId: contextMenuId.set,
  contextMenuId,
})