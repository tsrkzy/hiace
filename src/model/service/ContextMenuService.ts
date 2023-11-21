/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { get } from "svelte/store";
import { ContextMenuItem } from "@/model/ContextMenu";
import { useContextMenu } from "@/model/store/contextMenu";

const {
  setContextMenuItems,
  setShowContextMenu,
  setContextMenuX,
  setContextMenuY,
  setContextMenuIds,
  contextMenuIds,
} = useContextMenu();

export const dummyContextMenu = () => {
  setContextMenuItems(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
      i =>
        new ContextMenuItem({
          text: `コンテキストメニュー_${i}`,
          id: `value_${i}`,
          children:
            i % 2
              ? []
              : [
                  new ContextMenuItem({
                    text: `コンテキストメニュー_${i}_1`,
                    id: `value_${i}_1`,
                    children: [
                      new ContextMenuItem({
                        text: `コンテキストメニュー_${i}_1_1`,
                        id: `value_${i}_1_1`,
                      }),
                    ],
                  }),
                ],
        }),
    ),
  );
  setContextMenuX(300);
  setContextMenuY(400);
  setShowContextMenu(true);
};

export const hideContextMenu = () => {
  console.log("ContextMenuService.hideContextMenu");
  setShowContextMenu(false);
  setContextMenuItems([]);
};

export const execContextMenu = (
  level: number,
  contextMenuItem: ContextMenuItem,
) => {
  console.log("ContextMenuService.execContextMenu", contextMenuItem);
  const items = get(contextMenuIds);
  setContextMenuIds([...items.slice(0, level), contextMenuItem.id]);
};
