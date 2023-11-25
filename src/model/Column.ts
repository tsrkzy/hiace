/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export const ColumnDataTypes = {
  INT: "int",
  STR: "str",
  BOOL: "bool",
  REF: "ref",
} as const;
export type ColumnDataType =
  (typeof ColumnDataTypes)[keyof typeof ColumnDataTypes];

export type ColumnProps = {
  id: string;
  room: string;
  table: string;
  label: string;
  show: boolean;
  dataType: ColumnDataType;
  refPath: string;
  dataMap: { [key: string]: string | number | boolean | null };
  order: number;
};

export class Column {
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get room(): string {
    return this._room;
  }

  set room(value: string) {
    this._room = value;
  }

  get table(): string {
    return this._table;
  }

  set table(value: string) {
    this._table = value;
  }

  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  get show(): boolean {
    return this._show;
  }

  set show(value: boolean) {
    this._show = value;
  }

  get dataType(): ColumnDataType {
    return this._dataType;
  }

  set dataType(value: ColumnDataType) {
    this._dataType = value;
  }

  get refPath(): string {
    return this._refPath;
  }

  set refPath(value: string) {
    this._refPath = value;
  }

  get dataMap(): { [key: string]: string | number | boolean | null } {
    return this._dataMap;
  }

  set dataMap(value: { [key: string]: string | number | boolean | null }) {
    this._dataMap = value;
  }

  get order(): number {
    return this._order;
  }

  set order(value: number) {
    this._order = value;
  }

  private _id: string;
  private _room: string;
  private _table: string;
  private _label: string;
  private _show: boolean;
  private _dataType: ColumnDataType;
  private _refPath: string;
  private _dataMap: { [key: string]: string | number | boolean | null };
  private _order: number;

  /**
   * @param {ColumnProps} args
   */
  constructor(args: ColumnProps) {
    const { id, room, table, label, show, dataType, refPath, dataMap, order } =
      args;
    this._id = id;
    this._room = room;
    this._table = table;
    this._label = label;
    this._show = show;
    this._dataType = dataType;
    this._refPath = refPath;
    this._dataMap = dataMap;
    this._order = order;
  }
}
