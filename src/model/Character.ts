/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type CharacterProps = {
  id: string;
  name: string;
  room: string;
  owner: string;
  activeAlias: string;
  chatPosition: number;
  pawnSize: number;
  showOnInitiative: boolean;
  text: string;
  color?: string;
  lastPostDatetime?: number;
};

export type UnSavedCharacterProps = Omit<CharacterProps, "id">;

export class Character {
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

  get activeAlias(): string {
    return this._activeAlias;
  }

  set activeAlias(value: string) {
    this._activeAlias = value;
  }

  get chatPosition(): number {
    return this._chatPosition;
  }

  set chatPosition(value: number) {
    this._chatPosition = value;
  }

  get pawnSize(): number {
    return this._pawnSize;
  }

  set pawnSize(value: number) {
    this._pawnSize = value;
  }

  get showOnInitiative(): boolean {
    return this._showOnInitiative;
  }

  set showOnInitiative(value: boolean) {
    this._showOnInitiative = value;
  }

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
  }

  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
  }

  get lastPostDatetime(): number {
    return this._lastPostDatetime;
  }

  set lastPostDatetime(value: number) {
    this._lastPostDatetime = value;
  }

  private _id: string;
  private _name: string;
  private _room: string;
  private _owner: string;
  private _activeAlias: string;
  private _chatPosition: number;
  private _pawnSize: number;
  private _showOnInitiative: boolean;
  private _text: string;
  private _color: string;
  private _lastPostDatetime: number;

  /**
   *
   * @param {CharacterProps} args
   */
  constructor(args: CharacterProps) {
    const {
      id,
      name,
      room,
      owner,
      activeAlias,
      chatPosition,
      pawnSize,
      showOnInitiative,
      text,
      color,
      lastPostDatetime,
    } = args;
    this._id = id;
    this._name = name;
    this._room = room;
    this._owner = owner;
    this._activeAlias = activeAlias;
    this._chatPosition = chatPosition;
    this._pawnSize = pawnSize;
    this._showOnInitiative = showOnInitiative;
    this._text = text;
    this._color = color || "#000000";
    this._lastPostDatetime = lastPostDatetime || 0;
  }
}
