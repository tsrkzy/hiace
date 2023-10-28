/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type ColumnProps = {
  id: string;
  name: string;
};

export class Column {
  private _id: string;
  private _name: string;

  /**
   * @param {ColumnProps} args
   */
  constructor(args: ColumnProps) {
    const { id, name } = args;
    this._id = id;
    this._name = name;
  }
}
