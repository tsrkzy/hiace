/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type CharacterProps = {
  id: string;
  name: string;
};

export class Character {
  get Id(): string {
    return this._id;
  }

  set Id(value: string) {
    this._id = value;
  }
  get Name(): string {
    return this._name;
  }

  set Name(value: string) {
    this._name = value;
  }
  private _id: string;
  private _name: string;

  /**
   *
   * @param {CharacterProps} args
   */
  constructor(args: CharacterProps) {
    const { id, name } = args;
    this._id = id;
    this._name = name;
  }
}
