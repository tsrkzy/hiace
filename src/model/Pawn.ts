/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type PawnProps = {
  id: string;
  room: string;
  owner: string;
  board: string;
  image: string;
  character: string;
  transform: string;
  updatedAt: number;
};

export class Pawn {
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

  get owner(): string {
    return this._owner;
  }

  set owner(value: string) {
    this._owner = value;
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

  get character(): string {
    return this._character;
  }

  set character(value: string) {
    this._character = value;
  }

  get transform(): string {
    return this._transform;
  }

  set transform(value: string) {
    this._transform = value;
  }

  get updatedAt(): number {
    return this._updatedAt;
  }

  set updatedAt(value: number) {
    this._updatedAt = value;
  }

  private _id: string;
  private _room: string;
  private _owner: string;
  private _board: string;
  private _image: string;
  private _character: string;
  private _transform: string;
  private _updatedAt: number;

  /**
   * @param {PawnProps} args
   */
  constructor(args: PawnProps) {
    const { id, room, owner, board, image, character, transform, updatedAt } =
      args;
    this._id = id;
    this._room = room;
    this._owner = owner;
    this._board = board;
    this._image = image;
    this._character = character;
    this._transform = transform;
    this._updatedAt = updatedAt;
  }
}
