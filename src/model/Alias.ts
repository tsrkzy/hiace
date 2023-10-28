/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type AliasProps = {
  id: string;
  name: string;
  owner: string;
};

export class Alias {
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

  get owner(): string {
    return this._owner;
  }

  set owner(value: string) {
    this._owner = value;
  }

  private _id: string;
  private _name: string;
  private _owner: string;

  /**
   * @param {AliasProps} args
   */
  constructor(args: AliasProps) {
    const { id, name, owner } = args;
    this._id = id;
    this._name = name;
    this._owner = owner;
  }
}
