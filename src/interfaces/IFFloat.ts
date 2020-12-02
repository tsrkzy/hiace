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
  z: number;
  h: number;
  w: number;
}

export const UNSET = "UNSET";
export const CHARACTER_LIST = "CHARACTER_LIST";
export const CHARACTER_EDIT = "CHARACTER_EDIT";
export const BOARD_LIST = "BOARD_LIST";
export const CHAT_LIST = "CHAT_LIST";
export const TABLE_VIEW = "TABLE_VIEW";

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
    case TABLE_VIEW: {
      return "table view";
    }
  }
  throw new Error(`implement error: no title for contentId: ${id}`);
}

export class IFFloat implements IIFloat {
  static Id: number = 1;
  static instances: IFFloat[] = [];

  id = 0;
  show = false;
  contentId = UNSET;
  contentTitle = "";
  x = 100;
  y = 100;
  z = 1;
  w = 300;
  h = 200;
  args = null;

  constructor(contentId: string, show?: boolean, args?: any) {
    this.contentId = contentId;
    this.contentTitle = title(contentId);
    this.args = args;
    this.show = show ?? false;
    IFFloat.AssignId(this);
    IFFloat.instances.push(this);
    /* 表示状態で作成 → 最前列へ */
    if (show) {
      IFFloat.Pop(this.id);
    }
  }

  static AssignId(f: IFFloat) {
    f.id = IFFloat.Id;
    f.x += 20 * (f.id % 10);
    f.y += 20 * (f.id % 5);
    IFFloat.Id++;
  }

  static Pop(floatId: number) {
    const { instances = [] } = IFFloat;
    const MAX_Z = instances.length;
    const floatList = instances.slice().sort((a, b) =>
      /* zの降順かつ対象を最前列に */
      a.id === floatId ? -1 : b.id === floatId ? 1 : a.z < b.z ? 1 : -1
    );
    for (let i = 0; i < floatList.length; i++) {
      const f = floatList[i];
      f.z = MAX_Z - i;
    }
  }

  static Sink(floatId: number) {
    const { instances = [] } = IFFloat;
    const MAX_Z = instances.length;
    const floatList = instances.slice().sort((a, b) =>
      /* zの降順かつ対象を最後尾に */
      a.id === floatId ? 1 : b.id === floatId ? -1 : a.z < b.z ? 1 : -1
    );
    for (let i = 0; i < floatList.length; i++) {
      const f = floatList[i];
      f.z = MAX_Z - i;
    }
  }
}
