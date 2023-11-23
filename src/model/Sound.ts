/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type SoundProps = {
  id: string;
  name: string;
  room: string;
  owner: string;
  path: string;
  url: string;
  hidden?: boolean;
  duration: number;
  loop?: boolean;
  tags?: string[];
};

export class Sound {
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

  get owner(): string {
    return this._owner;
  }

  set owner(value: string) {
    this._owner = value;
  }

  get path(): string {
    return this._path;
  }

  set path(value: string) {
    this._path = value;
  }

  get url(): string {
    return this._url;
  }

  set url(value: string) {
    this._url = value;
  }

  get hidden(): boolean {
    return this._hidden;
  }

  set hidden(value: boolean) {
    this._hidden = value;
  }

  get duration(): number {
    return this._duration;
  }

  set duration(value: number) {
    this._duration = value;
  }

  get loop(): boolean {
    return this._loop;
  }

  set loop(value: boolean) {
    this._loop = value;
  }

  get tags(): string[] {
    return this._tags;
  }

  set tags(value: string[]) {
    this._tags = value;
  }

  private _id: string;
  private _name: string;
  private _room: string;
  private _owner: string;
  private _path: string;
  private _url: string;
  private _hidden: boolean;
  private _duration: number;
  private _loop: boolean;
  private _tags: string[];

  /**
   * @param {SoundProps} args
   */
  constructor(args: SoundProps) {
    const {
      id,
      name,
      room,
      owner,
      path,
      url,
      hidden = false,
      duration,
      loop = false,
      tags = [],
    } = args;
    this._id = id;
    this._name = name;
    this._room = room;
    this._owner = owner;
    this._path = path;
    this._url = url;
    this._hidden = hidden;
    this._duration = duration;
    this._loop = loop;
    this._tags = tags;
  }
}
