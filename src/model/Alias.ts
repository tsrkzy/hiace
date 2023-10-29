/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type AliasProps = {
  id: string;
  name: string;
  room: string;
  character: string;
  image: string;
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
  get room(): string {
    return this._room;
  }

  set room(value: string) {
    this._room = value;
  }
  get character(): string {
    return this._character;
  }

  set character(value: string) {
    this._character = value;
  }
  get image(): string {
    return this._image;
  }

  set image(value: string) {
    this._image = value;
  }

  private _id: string;
  private _name: string;
  private _room: string;
  private _character: string;
  private _image: string;

  /**
   * @param {AliasProps} args
   */
  constructor(args: AliasProps) {
    const { id, name, room, character, image } = args;
    this._id = id;
    this._name = name;
    this._room = room;
    this._character = character;
    this._image = image;
  }
}
