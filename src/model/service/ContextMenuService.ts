/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { useContextMenu } from "@/model/store/contextMenu";
import { ContextMenuItem } from "@/model/ContextMenu";

const {
  setContextMenuItems
  , setShowContextMenu
  , setContextMenuX
  , setContextMenuY
  , setContextMenuId
} = useContextMenu()


export const dummyContextMenu = () => {
  setContextMenuItems([1, 2, 3, 4, 5].map(i => new ContextMenuItem({
    text: `コンテキストメニュー_${i}`,
    id: `value_${i}`,
    children: i % 2 ? [] : [
      new ContextMenuItem({
        text: `コンテキストメニュー_${i}_1`,
        id: `value_${i}_1`,
      }),
    ]
  })))
  setContextMenuX(300)
  setContextMenuY(400)
  setShowContextMenu(true)
}

export const hideContextMenu = () => {
  console.log("ContextMenuService.hideContextMenu");
  setShowContextMenu(false)
  setContextMenuItems([])
}

export const execContextMenu = (contextMenuItem: ContextMenuItem) => {
  console.log("ContextMenuService.execContextMenu", contextMenuItem);
  setContextMenuId(contextMenuItem.id);
}