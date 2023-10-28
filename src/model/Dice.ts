/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type DiceProps = {
  id: string;
  name: string;
};

export class Dice {
  private _id: string;
  private _name: string;

  /**
   * @param {DiceProps} args
   */
  constructor(args: DiceProps) {
    const { id, name } = args;
    this._id = id;
    this._name = name;
  }
}
