/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

interface IIFloat {
  id: number;
  show: boolean;
  contentId: FloatContent;
  contentTitle: string;
  x: number;
  y: number;
  h: number;
  w: number;
}

export enum FloatContent {
  ERROR,
  CHARACTER_LIST,
  BOARD_LIST,
  CHAT_LIST
}

function title(id: FloatContent) {
  return ["ERROR", "character list", "board list", "chat list"][id];
}

export class IFFloat implements IIFloat {
  static Id = 1;

  id = 0;
  show = false;
  contentId = 0;
  contentTitle = "";
  x = 100;
  y = 100;
  w = 300;
  h = 200;

  constructor(contentId: FloatContent, show?: boolean) {
    this.contentId = contentId;
    this.contentTitle = title(contentId);
    this.show = show ?? false;
    IFFloat.AssignId(this);
  }

  static AssignId(f: IFFloat) {
    f.id = IFFloat.Id;
    IFFloat.Id++;
  }
}
