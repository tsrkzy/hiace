/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type ChannelProps = {
  id: string;
  name: string;
  type: string;
};

export class Channel {
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
  private _id: string;
  private _name: string;
  private _type: string;

  /**
   * @param {ChannelProps} args
   */
  constructor(args: ChannelProps) {
    const { id, name, type } = args;
    this._id = id;
    this._name = name;
    this._type = type;
  }
}
