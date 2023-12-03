/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { useContextMenu } from "@/model/store/contextMenu";

const { setContextMenuX, setContextMenuY, setShowContextMenu } =
  useContextMenu();

export const showContextMenuByMouseCursor = (e: MouseEvent) => {
  setContextMenuX(e.pageX);
  setContextMenuY(e.pageY);
  setShowContextMenu(true);
};
