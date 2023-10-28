/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type SoundProps = {
  id: string;
  name: string;
};

export class Sound {
  private _id: string;
  private _name: string;

  /**
   * @param {SoundProps} args
   */
  constructor(args: SoundProps) {
    const { id, name } = args;
    this._id = id;
    this._name = name;
  }
}
