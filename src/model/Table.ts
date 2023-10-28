/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type TableProps = {
  id: string;
  name: string;
};

export class Table {
  private _id: string;
  private _name: string;

  /**
   * @param {TableProps} args
   */
  constructor(args: TableProps) {
    const { id, name } = args;
    this._id = id;
    this._name = name;
  }
}
