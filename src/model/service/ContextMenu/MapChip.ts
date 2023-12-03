/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { ContextMenuItem } from "@/model/ContextMenu";
import { showContextMenuByMouseCursor } from "@/model/service/ContextMenu/helper";
import { useContextMenu } from "@/model/store/contextMenu";

const { setContextMenuItems } = useContextMenu();

export const showMapChipContextMenu = (e: MouseEvent, mapChipId: string) => {
  console.log("ContextMenuService.mapChipContextMenu", e, mapChipId);
  setContextMenuItems([
    new ContextMenuItem({
      text: "マップの編集",
      id: `edit_map_chip_${mapChipId}`,
      callback: () => {},
    }),
    new ContextMenuItem({
      text: "マップの削除",
      id: `delete_map_chip_${mapChipId}`,
      callback: () => {},
    }),
    new ContextMenuItem({
      text: "マップの位置を固定する",
      id: `toggle_map_chip_${mapChipId}`,
      callback: () => {},
    }),
    new ContextMenuItem({
      text: "ダイスを追加",
      id: `create_dice_on_map_chip_${mapChipId}`,
      callback: () => {},
    }),
  ]);

  showContextMenuByMouseCursor(e);
};
