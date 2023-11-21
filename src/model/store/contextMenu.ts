import { writable } from "svelte/store";
import { ContextMenuItem } from "@/model/ContextMenu";

const contextMenuItems = writable<ContextMenuItem[]>([]);
const showContextMenu = writable<boolean>(false);
const contextMenuX = writable<number>(0);
const contextMenuY = writable<number>(0);
const contextMenuIds = writable<string[]>([]);

contextMenuItems.subscribe(a => {
  console.log("contextMenuItems.subscribe", a);
});
showContextMenu.subscribe(a => {
  console.log("contextMenu.showContextMenu", a);
});
contextMenuX.subscribe(a => {
  console.log("contextMenu.contextMenuX", a);
});
contextMenuY.subscribe(a => {
  console.log("contextMenu.contextMenuY", a);
});
contextMenuIds.subscribe(a => {
  console.log("contextMenu.contextMenuIds", a);
});

export const useContextMenu = () => ({
  setContextMenuItems: contextMenuItems.set,
  contextMenuItems,
  setShowContextMenu: showContextMenu.set,
  showContextMenu,
  setContextMenuX: contextMenuX.set,
  contextMenuX,
  setContextMenuY: contextMenuY.set,
  contextMenuY,
  setContextMenuIds: contextMenuIds.set,
  contextMenuIds,
});
