/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

type LocalConfigProps = {
  maskChannel: boolean;
  ring: boolean;
};

export class LocalConfig {
  get maskChannel(): boolean {
    return this._maskChannel;
  }

  set maskChannel(value: boolean) {
    this._maskChannel = value;
  }

  get ring(): boolean {
    return this._ring;
  }

  set ring(value: boolean) {
    this._ring = value;
  }

  private _maskChannel: boolean;
  private _ring: boolean;

  constructor(props: LocalConfigProps) {
    this._maskChannel = props.maskChannel || false;
    this._ring = props.ring || false;
  }

  toJSONStr() {
    return JSON.stringify({
      maskChannel: this.maskChannel,
      ring: this.ring,
    });
  }
}
