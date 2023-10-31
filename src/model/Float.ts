/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export const ContentId = {
  UNSET: "UNSET",
  CHARACTER_LIST: "CHARACTER_LIST",
  CHARACTER_EDIT: "CHARACTER_EDIT",
  BOARD_LIST: "BOARD_LIST",
  MAP_EDIT: "MAP_EDIT",
  CHAT_LIST: "CHAT_LIST",
  TABLE_VIEW: "TABLE_VIEW",
  CHAT_PALETTE: "CHAT_PALETTE",
  IMAGE_MANAGER: "IMAGE_MANAGER",
  SOUND_MANAGER: "SOUND_MANAGER",
  ROOM_MANAGER: "ROOM_MANAGER",
  CHANNEL_LIST: "CHANNEL_LIST",
  NOTE_MANAGER: "NOTE_MANAGER",
  ISSUE_WRITER: "ISSUE_WRITER",
} as const;
type ContentId = (typeof ContentId)[keyof typeof ContentId];

export type FloatProps = {
  id: number;
  show: boolean;
  contentId: ContentId;
  contentTitle: string;
  x: number;
  y: number;
  z: number;
  h: number;
  w: number;
};

export class Float {
  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get show(): boolean {
    return this._show;
  }

  set show(value: boolean) {
    this._show = value;
  }

  get contentId(): ContentId {
    return this._contentId;
  }

  set contentId(value: ContentId) {
    this._contentId = value;
  }

  get contentTitle(): string {
    return this._contentTitle;
  }

  set contentTitle(value: string) {
    this._contentTitle = value;
  }

  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }

  get z(): number {
    return this._z;
  }

  set z(value: number) {
    this._z = value;
  }

  get h(): number {
    return this._h;
  }

  set h(value: number) {
    this._h = value;
  }

  get w(): number {
    return this._w;
  }

  set w(value: number) {
    this._w = value;
  }

  private _id: number;
  private _show: boolean;
  private _contentId: ContentId;
  private _contentTitle: string;
  private _x: number;
  private _y: number;
  private _z: number;
  private _h: number;
  private _w: number;

  /**
   * @param {FloatProps} args
   */
  constructor(args: FloatProps) {
    const { id, show, contentId, contentTitle, x, y, z, h, w } = args;
    this._id = id;
    this._show = show;
    this._contentId = contentId;
    this._contentTitle = contentTitle;
    this._x = x;
    this._y = y;
    this._z = z;
    this._h = h;
    this._w = w;
  }
}
