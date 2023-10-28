/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type MapChipProps = {
  id: string;
  name: string;
};

export class MapChip {
  private _id: string;
  private _name: string;

  /**
   * @param {MapChipProps} args
   */
  constructor(args: MapChipProps) {
    const { id, name } = args;
    this._id = id;
    this._name = name;
  }
}
