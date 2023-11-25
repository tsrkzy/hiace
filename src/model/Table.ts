/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type TableProps = {
  id: string;
  name: string;
  room: string;
  filterColumns: string[];
  filterCharacters: string[];
};

export class Table {
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get room(): string {
    return this._room;
  }

  set room(value: string) {
    this._room = value;
  }

  get filterColumns(): string[] {
    return this._filterColumns;
  }

  set filterColumns(value: string[]) {
    this._filterColumns = value;
  }

  get filterCharacters(): string[] {
    return this._filterCharacters;
  }

  set filterCharacters(value: string[]) {
    this._filterCharacters = value;
  }

  private _id: string;
  private _name: string;
  private _room: string;
  private _filterColumns: string[];
  private _filterCharacters: string[];

  /**
   * @param {TableProps} args
   */
  constructor(args: TableProps) {
    const { id, name, room, filterColumns = [], filterCharacters = [] } = args;
    this._id = id;
    this._name = name;
    this._room = room;
    this._filterColumns = filterColumns;
    this._filterCharacters = filterCharacters;
  }
}
