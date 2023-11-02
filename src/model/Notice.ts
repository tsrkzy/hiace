/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

interface NoticeProps {
  level: number;
  text: string;
}

export class Notice {
  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get level(): number {
    return this._level;
  }

  set level(value: number) {
    this._level = value;
  }

  get text(): string {
    return this._text;
  }

  set text(value: string) {
    this._text = value;
  }

  static Id = 0;
  private _id: number;
  private _level: number;
  private _text: string;

  static GetId() {
    return this.Id++;
  }

  constructor(props: NoticeProps) {
    this._id = Notice.GetId();
    this._level = props.level;
    this._text = props.text;
  }
}
