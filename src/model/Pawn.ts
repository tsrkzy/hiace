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
};

export class Pawn {
  private _id: string;
  private _room: string;
  private _owner: string;
  private _board: string;
  private _image: string;
  private _character: string;
  private _transform: string;

  /**
   * @param {PawnProps} args
   */
  constructor(args: PawnProps) {
    const { id, room, owner, board, image, character, transform } = args;
    this._id = id;
    this._room = room;
    this._owner = owner;
    this._board = board;
    this._image = image;
    this._character = character;
    this._transform = transform;
  }
}
