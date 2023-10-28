/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type UserProps = {
  id: string;
  name: string;
  color: string;
  email: string;
  joinTo: string[];
  lastPing: number;
  photoUrl: string;
};

/**
 * 現在参加しているRoomに同じく参加中のすべてのユーザについての情報を保持する
 */
export class User {
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
  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
  }
  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }
  get joinTo(): string[] {
    return this._joinTo;
  }

  set joinTo(value: string[]) {
    this._joinTo = value;
  }
  get lastPing(): number {
    return this._lastPing;
  }

  set lastPing(value: number) {
    this._lastPing = value;
  }
  get photoUrl(): string {
    return this._photoUrl;
  }

  set photoUrl(value: string) {
    this._photoUrl = value;
  }
  private _id: string;
  private _name: string;
  private _color: string;
  private _email: string;
  private _joinTo: string[];
  private _lastPing: number;
  private _photoUrl: string;

  /**
   *
   * @param {UserProps} args
   */
  constructor(args: UserProps) {
    const { id, name, color, email, joinTo, lastPing, photoUrl } = args;
    this._id = id;
    this._name = name;
    this._color = color;
    this._email = email;
    this._joinTo = joinTo;
    this._lastPing = lastPing;
    this._photoUrl = photoUrl;
  }
}
