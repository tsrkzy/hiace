/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { type DiceColor ,type DiceValue } from "@/constant";

export type DiceProps = {
  id: string;
  room: string;
  owner: string;
  board: string;
  color: DiceColor;
  face: DiceValue;
  hidden: boolean;
  transform: string;
  updatedAt: number|Date;
};

export class Dice {
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

  get color(): DiceColor {
    return this._color;
  }

  set color(value: DiceColor) {
    this._color = value;
  }

  get face(): DiceValue {
    return this._face;
  }

  set face(value: DiceValue) {
    this._face = value;
  }

  get hidden(): boolean {
    return this._hidden;
  }

  set hidden(value: boolean) {
    this._hidden = value;
  }

  get transform(): string {
    return this._transform;
  }

  set transform(value: string) {
    this._transform = value;
  }

  get updatedAt(): number|Date {
    return this._updatedAt;
  }

  set updatedAt(value: number|Date) {
    this._updatedAt = value;
  }

  private _id: string;
  private _room: string;
  private _owner: string;
  private _board: string;
  private _color: DiceColor;
  private _face: DiceValue;
  private _hidden: boolean;
  private _transform: string;
  private _updatedAt: number|Date;

  /**
   * @param {DiceProps} args
   */
  constructor(args: DiceProps) {
    const
      {
        id,
        room,
        owner,
        board,
        color,
        face,
        hidden = false,
        transform,
        updatedAt,
      } = args;
    this._id = id;
    this._room = room
    this._owner = owner
    this._board = board
    this._color = color
    this._face = face
    this._hidden = hidden
    this._transform = transform
    this._updatedAt = updatedAt
  }
}
