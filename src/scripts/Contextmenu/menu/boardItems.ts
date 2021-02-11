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

export function boardItems(): ContextMenuItem[] {
  const board = store.getters["room/activeBoard"];

  if (!board) {
    throw new Error("no active-board found");
  }

  const result: ContextMenuItem[] = [];

  /* ウィンドウの位置をリセット */
  const resetFloatWindows = new ContextMenuChildItem({
    value: `reset_float_windows`,
    text: "ウィンドウの位置をリセット",
    callback: async () => {
      await store.dispatch("float/reset");
    }
  });

  result.push(resetFloatWindows);

  return result;
}
