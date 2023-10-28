/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type BoardProps = {
  id: string;
  name: string;
};

export class Board {
  private _id: string;
  private _name: string;

  /**
   * @param {BoardProps} args
   */
  constructor(args: BoardProps) {
    const { id, name } = args;
    this._id = id;
    this._name = name;
  }
}
