/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { useTables } from "@/model/store/tables";

const { setShowCellEditor, setCellEditorTarget } = useTables();

export const hideCellEditor = () => {
  console.log("CellEditorService.hideCellEditor");
  setShowCellEditor(false);
  setCellEditorTarget(null);
};
