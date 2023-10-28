/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type ImageProps = {
  id: string;
  name: string;
};

export class Image {
  private _id: string;
  private _name: string;

  /**
   * @param {ImageProps} args
   */
  constructor(args: ImageProps) {
    const { id, name } = args;
    this._id = id;
    this._name = name;
  }
}
