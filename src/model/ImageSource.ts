/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type ImageSourceProps = {
  id: string;
  name: string;
};

export class ImageSource {
  private _id: string;
  private _name: string;

  /**
   * @param {ImageSourceProps} args
   */
  constructor(args: ImageSourceProps) {
    const { id, name } = args;
    this._id = id;
    this._name = name;
  }
}
