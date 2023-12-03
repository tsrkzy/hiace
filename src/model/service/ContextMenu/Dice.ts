/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { useContextMenu } from "@/model/store/contextMenu";
import { ContextMenuItem } from "@/model/ContextMenu";
import { showContextMenuByMouseCursor } from "@/model/service/ContextMenu/helper";

const { setContextMenuItems } = useContextMenu();

export const showDiceContextMenu = (e: MouseEvent, diceId: string) => {
  setContextMenuItems([
    new ContextMenuItem({
      text: "ダイスの目を変更",
      id: `change_face_${diceId}`,
      children: [],
    }),
    new ContextMenuItem({
      text: "ダイスを振る",
      id: `roll_dice_${diceId}`,
      callback: () => {},
    }),
    new ContextMenuItem({
      text: "ダイスの色を変更",
      id: `change_dice_color_${diceId}`,
      children: [],
    }),
    new ContextMenuItem({
      text: "ダイスを追加",
      id: `create_dice_on_map_chip_${diceId}`,
      callback: () => {},
    }),
    new ContextMenuItem({
      text: "ダイスを削除",
      id: `delete_dice_${diceId}`,
      callback: () => {},
    }),
  ]);

  showContextMenuByMouseCursor(e);
};
