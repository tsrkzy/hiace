/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

interface IIFloat {
  id: number;
  show: boolean;
  contentId: string;
  contentTitle: string;
  x: number;
  y: number;
  h: number;
  w: number;
}

export const UNSET = "UNSET";
export const CHARACTER_LIST = "CHARACTER_LIST";
export const CHARACTER_EDIT = "CHARACTER_EDIT";
export const BOARD_LIST = "BOARD_LIST";
export const CHAT_LIST = "CHAT_LIST";

function title(id: string) {
  switch (id) {
    case UNSET: {
      return "content has not set yet";
    }
    case CHARACTER_LIST: {
      return "character list";
    }
    case CHARACTER_EDIT: {
      return "character edit";
    }
    case BOARD_LIST: {
      return "board list";
    }
    case CHAT_LIST: {
      return "chat list";
    }
  }
  throw new Error(`implement error: no title for contentId: ${id}`);
}

export class IFFloat implements IIFloat {
  static Id = 1;

  id = 0;
  show = false;
  contentId = UNSET;
  contentTitle = "";
  x = 100;
  y = 100;
  w = 300;
  h = 200;
  args = null;

  constructor(contentId: string, show?: boolean, args?: any) {
    this.contentId = contentId;
    this.contentTitle = title(contentId);
    this.args = args;
    this.show = show ?? false;
    IFFloat.AssignId(this);
  }

  static AssignId(f: IFFloat) {
    f.id = IFFloat.Id;
    IFFloat.Id++;
  }
}
