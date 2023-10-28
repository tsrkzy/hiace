/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type PawnProps = {
  id: string;
  name: string;
};

export class Pawn {
  private _id: string;
  private _name: string;

  /**
   * @param {PawnProps} args
   */
  constructor(args: PawnProps) {
    const { id, name } = args;
    this._id = id;
    this._name = name;
  }
}
