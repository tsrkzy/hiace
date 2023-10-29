/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type ChannelProps = {
  id: string;
  name: string;
  room: string;
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
  get room(): string {
    return this._room;
  }

  set room(value: string) {
    this._room = value;
  }
  private _id: string;
  private _name: string;
  private _room: string;

  /**
   * @param {ChannelProps} args
   */
  constructor(args: ChannelProps) {
    const { id, name, room } = args;
    this._id = id;
    this._name = name;
    this._room = room;
  }
}
