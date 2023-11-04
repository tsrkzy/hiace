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
  image: string;
  owner: string;
  backgroundColor: string;
  offsetX: number;
  offsetY: number;
  scalePp: number;
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
  get image(): string {
    return this._image;
  }

  set image(value: string) {
    this._image = value;
  }
  get owner(): string {
    return this._owner;
  }

  set owner(value: string) {
    this._owner = value;
  }
  get backgroundColor(): string {
    return this._backgroundColor;
  }

  set backgroundColor(value: string) {
    this._backgroundColor = value;
  }
  get offsetX(): number {
    return this._offsetX;
  }

  set offsetX(value: number) {
    this._offsetX = value;
  }
  get offsetY(): number {
    return this._offsetY;
  }

  set offsetY(value: number) {
    this._offsetY = value;
  }
  get scalePp(): number {
    return this._scalePp;
  }

  set scalePp(value: number) {
    this._scalePp = value;
  }

  private _id: string;
  private _room: string;
  private _board: string;
  private _image: string;
  private _owner: string;
  private _backgroundColor: string;
  private _offsetX: number;
  private _offsetY: number;
  private _scalePp: number;

  /**
   * @param {MapChipProps} args
   */
  constructor(args: MapChipProps) {
    const {
      id,
      room,
      board,
      image,
      owner,
      backgroundColor,
      offsetX,
      offsetY,
      scalePp,
    } = args;
    this._id = id;
    this._room = room;
    this._board = board;
    this._image = image;
    this._owner = owner;
    this._backgroundColor = backgroundColor;
    this._offsetX = offsetX;
    this._offsetY = offsetY;
    this._scalePp = scalePp;
  }
}
