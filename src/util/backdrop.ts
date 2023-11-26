/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { hideContextMenu } from "@/model/service/ContextMenuService";
import { hideCellEditor } from "@/model/service/CellEditorService";

export const hideBackdrop = () => {
  hideContextMenu();
  hideCellEditor();
};
