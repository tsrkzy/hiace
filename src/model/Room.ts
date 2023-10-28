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
  get owner(): string {
    return this._owner;
  }

  set owner(value: string) {
    this._owner = value;
  }
  get keepers(): string[] {
    return this._keepers;
  }

  set keepers(value: string[]) {
    this._keepers = value;
  }
  get requests(): string[] {
    return this._requests;
  }

  set requests(value: string[]) {
    this._requests = value;
  }
  get kicked(): string[] {
    return this._kicked;
  }

  set kicked(value: string[]) {
    this._kicked = value;
  }
  get users(): string[] {
    return this._users;
  }

  set users(value: string[]) {
    this._users = value;
  }
  get gameSystem(): string {
    return this._gameSystem;
  }

  set gameSystem(value: string) {
    this._gameSystem = value;
  }
  get music(): string {
    return this._music;
  }

  set music(value: string) {
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
