/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type UserProps = {
  id: string;
  name: string;
  room: string;
  text: string;
};

/**
 * 現在参加しているRoomに同じく参加中のすべてのユーザについての情報を保持する
 */
export class Note {
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

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
  }

  private _id: string;
  private _name: string;
  private _room: string;
  private _text: string;

  /**
   *
   * @param {UserProps} args
   */
  constructor(args: UserProps) {
    const { id, name, room, text } = args;
    this._id = id;
    this._name = name;
    this._room = room;
    this._text = text;
  }
}
