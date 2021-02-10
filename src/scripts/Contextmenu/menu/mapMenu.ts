/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import {
  ContextMenuChildItem,
  ContextMenuItem
} from "@/scripts/Contextmenu/ContextMenu";
import store from "@/store";
import { MAP_EDIT } from "@/interfaces/IFFloat";
import { FSMap } from "@/collections/Map";

export function mapItems(mapId: string): ContextMenuItem[] {
  const map = store.getters["map/info"].find(
    (m: { id: string }) => m.id === mapId
  );

  if (!map) {
    throw new Error(`no map exists: ${mapId}`);
  }

  const result: ContextMenuItem[] = [];

  /* マップ編集 */
  const editMapItem = new ContextMenuChildItem({
    value: `edit_map_${mapId}`,
    text: `マップの編集`,
    callback: async () => {
      const contentId = MAP_EDIT;
      const show = true;
      const args = { mapId };
      await store.dispatch("float/create", { contentId, show, args });
    }
  });

  /* マップの位置を固定 */
  const locked = !!map.dragLock;
  const toggleLockMapItem = new ContextMenuChildItem({
    value: `toggle_map_${mapId}`,
    text: locked ? "マップを移動可能にする" : "マップの位置を固定する",
    callback: async () => {
      await FSMap.Update(mapId, { dragLock: !locked });
    }
  });
  /* マップの削除 */
  const deleteMapItem = new ContextMenuChildItem({
    value: `delete_map_${mapId}`,
    text: "マップを削除する",
    callback: async () => {
      await FSMap.Delete(mapId);
    }
  });

  result.push(editMapItem);
  result.push(toggleLockMapItem);
  result.push(deleteMapItem);

  return result;
}
