/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type BoardProps = {
  id: string;
  room: string;
};

export class Board {
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get room(): string {
    return this._room;
  }

  set room(value: string) {
    this._room = value;
  }

  private _id: string;
  private _room: string;

  /**
   * @param {BoardProps} args
   */
  constructor(args: BoardProps) {
    const { id, room } = args;
    this._id = id;
    this._room = room;
  }
}
