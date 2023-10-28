/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type AliasProps = {
  id: string;
  name: string;
};

export class Alias {
  private _id: string;
  private _name: string;

  /**
   * @param {AliasProps} args
   */
  constructor(args: AliasProps) {
    const { id, name } = args;
    this._id = id;
    this._name = name;
  }
}
