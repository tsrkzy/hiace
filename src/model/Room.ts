/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type RoomProps = {
  id: string;
  name: string;
  owner: string;
  keepers: string[];
  requests: string[];
  kicked: string[];
  users: string[];
  gameSystem: string;
  music: string;
};

/**
 * ログイン中のRoom情報を保持する
 */
export class Room {
  get Id(): string {
    return this._id;
  }

  set Id(value: string) {
    this._id = value;
  }

  get Name(): string {
    return this._name;
  }

  set Name(value: string) {
    this._name = value;
  }

  get Owner(): string {
    return this._owner;
  }

  set Owner(value: string) {
    this._owner = value;
  }

  get Keepers(): string[] {
    return this._keepers;
  }

  set Keepers(value: string[]) {
    this._keepers = value;
  }

  get Requests(): string[] {
    return this._requests;
  }

  set Requests(value: string[]) {
    this._requests = value;
  }

  get Kicked(): string[] {
    return this._kicked;
  }

  set Kicked(value: string[]) {
    this._kicked = value;
  }

  get Users(): string[] {
    return this._users;
  }

  set Users(value: string[]) {
    this._users = value;
  }

  get GameSystem(): string {
    return this._gameSystem;
  }

  set GameSystem(value: string) {
    this._gameSystem = value;
  }

  get Music(): string {
    return this._music;
  }

  set Music(value: string) {
    this._music = value;
  }

  private _id: string;
  private _name: string;
  private _owner: string;
  private _keepers: string[];
  private _requests: string[];
  private _kicked: string[];
  private _users: string[];
  private _gameSystem: string;
  private _music: string;

  /**
   * @param {RoomProps} args
   */
  constructor(args: RoomProps) {
    const {
      id,
      name,
      owner,
      keepers,
      requests,
      kicked,
      users,
      gameSystem,
      music,
    } = args;
    this._id = id;
    this._name = name;
    this._owner = owner;
    this._keepers = keepers;
    this._requests = requests;
    this._kicked = kicked;
    this._users = users;
    this._gameSystem = gameSystem;
    this._music = music;
  }
}
