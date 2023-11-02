/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type ImageSourceProps = {
  id: string;
  room: string;
  owner: string;
  path: string;
  url: string;
  height: number;
  width: number;
  hidden: boolean;
  tags: string[];
  timestamp?: number | Date;
};

export class ImageSource {
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

  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
  }

  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }

  get hidden(): boolean {
    return this._hidden;
  }

  set hidden(value: boolean) {
    this._hidden = value;
  }

  get tags(): string[] {
    return this._tags;
  }

  set tags(value: string[]) {
    this._tags = value;
  }

  get timestamp(): number | Date {
    return this._timestamp;
  }

  set timestamp(value: number | Date) {
    this._timestamp = value;
  }

  private _id: string;
  private _room: string;
  private _owner: string;
  private _path: string;
  private _url: string;
  private _height: number;
  private _width: number;
  private _hidden: boolean;
  private _tags: string[];
  private _timestamp: number | Date;

  /**
   * @param {ImageSourceProps} args
   */
  constructor(args: ImageSourceProps) {
    const {
      id,
      room,
      owner,
      path,
      url,
      height,
      width,
      hidden,
      tags = [],
      timestamp = Date.now(),
    } = args;
    this._id = id;
    this._room = room;
    this._owner = owner;
    this._path = path;
    this._url = url;
    this._height = height;
    this._width = width;
    this._hidden = hidden;
    this._tags = tags;
    this._timestamp = timestamp;
  }
}
