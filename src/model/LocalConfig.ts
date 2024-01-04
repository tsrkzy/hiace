/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

type LocalConfigProps = {
  isRing: boolean;
  isBackGround: boolean;
};

export class LocalConfig {
  get isRing(): boolean {
    return this._isRing;
  }

  set isRing(value: boolean) {
    this._isRing = value;
  }

  get isBackGround(): boolean {
    return this._isBackGround;
  }

  set isBackGround(value: boolean) {
    this._isBackGround = value;
  }

  private _isRing: boolean;
  private _isBackGround: boolean;

  constructor(props: LocalConfigProps) {
    this._isRing = props.isRing || false;
    this._isBackGround = props.isBackGround || false;
  }

  toJSONStr() {
    return JSON.stringify({
      isRing: this.isRing,
      isBackGround: this.isBackGround,
    });
  }
}
