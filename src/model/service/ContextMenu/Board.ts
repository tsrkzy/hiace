/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { ContextMenuItem } from "@/model/ContextMenu";
import { showContextMenuByMouseCursor } from "@/model/service/ContextMenu/helper";
import { useContextMenu } from "@/model/store/contextMenu";
import { resetFloatWindows } from "@/model/service/FloatService";
import { resetAllMapChipPosition } from "@/model/service/BoardService";

const { setContextMenuItems } = useContextMenu();

export const showBoardContextMenu = (e: MouseEvent, boardId: string) => {
  console.log("Board.showBoardContextMenu", boardId);

  setContextMenuItems([
    new ContextMenuItem({
      text: "ウィンドウの位置をリセット",
      id: "reset_float_windows",
      callback: () => resetFloatWindows()
    }),
    new ContextMenuItem({
      text: "ボードの位置をリセット",
      id: "reset_board_position",
      callback: () => resetAllMapChipPosition(),
    }),
  ]);

  showContextMenuByMouseCursor(e);
};
