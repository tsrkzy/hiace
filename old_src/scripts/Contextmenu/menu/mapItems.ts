/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import {
  ContextMenuChildItem,
  ContextMenuItem,
} from "@/scripts/Contextmenu/ContextMenu";
import store from "@/store";
import { MAP_EDIT } from "@/interfaces/IFFloat";
import { FSMap } from "@/collections/Map";
import { DICE_BLACK, DICE_VALUE_ASTER, FSDice } from "@/collections/Dice";
import { touchFree } from "@/scripts/touch";

export function mapItems(mapId: string): ContextMenuItem[] {
  const boardId = store.getters["room/activeBoard"];
  if (!boardId) {
    throw new Error("no active-boardId found");
  }

  const map = store.getters["map/info"].find(
    (m: { id: string }) => m.id === mapId
  );
  if (!map) {
    throw new Error(`no map exists: ${mapId}`);
  }
  const { transform: _transform } = map;

  const roomId = store.getters["room/info"].id;
  const userId = store.getters["auth/user"].id;

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
    },
  });

  /* マップの位置を固定 */
  const locked = !!map.dragLock;
  const toggleLockMapItem = new ContextMenuChildItem({
    value: `toggle_map_${mapId}`,
    text: locked ? "マップを移動可能にする" : "マップの位置を固定する",
    callback: async () => {
      await FSMap.Update(mapId, { dragLock: !locked });
    },
  });
  /* マップの削除 */
  const deleteMapItem = new ContextMenuChildItem({
    value: `delete_map_${mapId}`,
    text: "マップを削除する",
    callback: async () => {
      await FSMap.Delete(mapId);
    },
  });

  /* ダイスを追加 */
  const createDiceItem = new ContextMenuChildItem({
    value: `create_dice_on_map_${mapId}`,
    text: "ダイスを追加",
    callback: async () => {
      const transform = new DOMMatrix(_transform);
      /* 拡縮をリセット */
      transform.a = 1;
      transform.b = 0;
      transform.c = 0;
      transform.d = 1;
      const face = DICE_VALUE_ASTER;
      const color = DICE_BLACK;
      await FSDice.Create({
        boardId,
        roomId,
        userId,
        face,
        color,
        transform,
      });
      touchFree(`ダイスを追加しました`);
    },
  });

  result.push(editMapItem);
  result.push(toggleLockMapItem);
  result.push(deleteMapItem);
  result.push(createDiceItem);

  return result;
}
