/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export const ChatType = {
  /* ユーザーのチャット */
  TEXT: "TEXT",
  /* BCDiceの結果 */
  DICE: "DICE",
  /* DCDice(secret)の結果 */
  DICE_SECRET: "DICE_SECRET",
  /* ログイン通知、ダイス操作ログなどのシステム通知 */
  SYSTEM: "SYSTEM",
} as const;
export type ChatType = (typeof ChatType)[keyof typeof ChatType];

export const SYSTEM_CHANNEL_ID = "SYSTEM";
export type ChatValue = {
  text: string;
  command?: string;
  result?: string;
  secret?: boolean;
};

export type ChatProps = {
  id: string;
  channel: string;
  alias: string | null;
  character: string | null;
  color: string;
  owner: string;
  room: string;
  type: string;
  value: ChatValue;
  timestamp: number | Date;
};

export class Chat {
  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get channel(): string {
    return this._channel;
  }

  set channel(value: string) {
    this._channel = value;
  }

  get alias(): string | null {
    return this._alias;
  }

  set alias(value: string | null) {
    this._alias = value;
  }

  get character(): string | null {
    return this._character;
  }

  set character(value: string | null) {
    this._character = value;
  }

  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
  }

  get owner(): string {
    return this._owner;
  }

  set owner(value: string) {
    this._owner = value;
  }

  get room(): string {
    return this._room;
  }

  set room(value: string) {
    this._room = value;
  }

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }

  get value(): ChatValue {
    return this._value;
  }

  set value(value: ChatValue) {
    this._value = value;
  }

  get timestamp(): number | Date {
    return this._timestamp;
  }

  set timestamp(value: number | Date) {
    this._timestamp = value;
  }

  private _id: string;
  private _channel: string;
  private _alias: string | null;
  private _character: string | null;
  private _color: string;
  private _owner: string;
  private _room: string;
  private _type: string;
  private _value: ChatValue;
  private _timestamp: number | Date;

  /**
   * @param {ChatProps} args
   */
  constructor(args: ChatProps) {
    const {
      id,
      channel,
      alias,
      character,
      color,
      owner,
      room,
      type,
      value,
      timestamp,
    } = args;
    this._id = id;
    this._channel = channel;
    this._alias = alias;
    this._character = character;
    this._color = color;
    this._owner = owner;
    this._room = room;
    this._type = type;
    this._value = value;
    this._timestamp = timestamp;
  }
}
