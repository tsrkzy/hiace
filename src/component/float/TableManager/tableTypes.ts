/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { type ColumnDataType } from "@/model/Column";

export type ColData = {
  id: string;
  system: boolean;
  roomId: string;
  label: string;
  dataType: ColumnDataType;
  refPath: string;
  dataMap: { [key: string]: string | number | boolean | null };
};

export type CellData = {
  columnId: string;
  system: boolean;
  characterId: string;
  value: string | number | boolean | null;
  dataType: ColumnDataType;
  refPath: string;
};

export type RowData = {
  characterId: string;
  cells: CellData[];
};

export type CellEditorTarget = {
  tableId: string;
  cellData: CellData;
}