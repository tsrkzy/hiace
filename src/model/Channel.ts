/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type ChannelProps = {
  id: string;
  name: string;
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

  /**
   * @param {ChannelProps} args
   */
  constructor(args: ChannelProps) {
    const { id, name } = args;
    this._id = id;
    this._name = name;
  }
}
