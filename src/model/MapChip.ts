/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type MapChipProps = {
  id: string;
  room: string;
  board: string;
};

export class MapChip {
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

  get board(): string {
    return this._board;
  }

  set board(value: string) {
    this._board = value;
  }

  private _id: string;
  private _room: string;
  private _board: string;

  /**
   * @param {MapChipProps} args
   */
  constructor(args: MapChipProps) {
    const { id, board } = args;
    this._id = id;
    this._room = board;
    this._board = board;
  }
}
