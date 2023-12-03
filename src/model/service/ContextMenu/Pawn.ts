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

export const showPawnContextMenu = (e: MouseEvent, pawnId: string) => {
  console.log("ContextMenuService.showPawnContextMenu", e, pawnId);
  setContextMenuItems([
    new ContextMenuItem({
      text: "コマを原点に戻す",
      id: `reset_pawn_${pawnId}`,
      callback: () => {},
    }),
    new ContextMenuItem({
      text: "キャラクタの編集",
      id: `edit_pawn_character_${pawnId}`,
      callback: () => {},
    }),

    new ContextMenuItem({
      text: "キャラクタを複製する",
      id: `copy_character_${pawnId}`,
      callback: () => {},
    }),
    new ContextMenuItem({
      text: "キャラクタを控室へ隠す",
      id: `archive_character_${pawnId}`,
      callback: () => {},
    }),
    new ContextMenuItem({
      text: "コマを複製する",
      id: `copy_pawn_${pawnId}`,
      callback: () => {},
    }),
    new ContextMenuItem({
      text: "コマの削除",
      id: `delete_pawn_${pawnId}`,
      callback: () => {},
    }),
    new ContextMenuItem({
      text: "コマの大きさを変更する",
      id: `resize_pawn_${pawnId}`,
      children: [],
    }),
    new ContextMenuItem({
      text: "線を引く/消す",
      id: `manage_line_${pawnId}`,
      children: [],
    }),
    new ContextMenuItem({
      text: "コマの重ね順を一番下にする",
      id: `send_to_back_${pawnId}`,
      callback: () => {},
    }),
  ]);

  showContextMenuByMouseCursor(e);
};
