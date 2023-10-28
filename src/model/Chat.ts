/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export type ChatProps = {
  id: string;
  name: string;
};

export class Chat {
  private _id: string;
  private _name: string;

  /**
   * @param {ChatProps} args
   */
  constructor(args: ChatProps) {
    const { id, name } = args;
    this._id = id;
    this._name = name;
  }
}
