/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { HM_CHARACTER_ARCHIVE, HM_TABLE_COLUMN } from "@/message";

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

/* contentId */
export const UNSET = "UNSET";
export const CHARACTER_LIST = "CHARACTER_LIST";
export const CHARACTER_EDIT = "CHARACTER_EDIT";
export const BOARD_LIST = "BOARD_LIST";
export const MAP_EDIT = "MAP_EDIT";
export const CHAT_LIST = "CHAT_LIST";
export const TABLE_VIEW = "TABLE_VIEW";
export const IMAGE_MANAGER = "IMAGE_MANAGER";
export const SOUND_MANAGER = "SOUND_MANAGER";
export const ROOM_MANAGER = "ROOM_MANAGER";
export const CHANNEL_LIST = "CHANNEL_LIST";
export const NOTE_MANAGER = "NOTE_MANAGER";
export const ISSUE_WRITER = "ISSUE_WRITER";

/* floatを複数枚作成しないもの */
const singletonList = [
  CHARACTER_LIST,
  BOARD_LIST,
  TABLE_VIEW,
  IMAGE_MANAGER,
  SOUND_MANAGER,
  ROOM_MANAGER,
  ISSUE_WRITER
];

/* 場所を記憶する、つまりアプリ開始時に表示可能なもの */
const startUpList = [
  CHARACTER_LIST,
  BOARD_LIST,
  CHAT_LIST,
  TABLE_VIEW,
  IMAGE_MANAGER,
  SOUND_MANAGER,
  ROOM_MANAGER,
  ISSUE_WRITER
];

/* help */
export const FLOAT_HELP_MESSAGES = {
  [UNSET]: [],
  [CHARACTER_LIST]: [HM_CHARACTER_ARCHIVE],
  [CHARACTER_EDIT]: [],
  [BOARD_LIST]: [],
  [MAP_EDIT]: [],
  [CHAT_LIST]: [],
  [TABLE_VIEW]: [HM_TABLE_COLUMN],
  [IMAGE_MANAGER]: [],
  [SOUND_MANAGER]: [],
  [ROOM_MANAGER]: [],
  [CHANNEL_LIST]: [],
  [NOTE_MANAGER]: [],
  [ISSUE_WRITER]: []
};

export function title(id: string) {
  switch (id) {
    case CHARACTER_LIST: {
      return "キャラクタ一覧";
    }
    case CHARACTER_EDIT: {
      return "キャラクタ編集";
    }
    case BOARD_LIST: {
      return "マップオブジェクト";
    }
    case MAP_EDIT: {
      return "マップ編集";
    }
    case CHAT_LIST: {
      return "チャット";
    }
    case TABLE_VIEW: {
      return "データテーブル";
    }
    case IMAGE_MANAGER: {
      return "画像管理";
    }
    case SOUND_MANAGER: {
      return "サウンド管理";
    }
    case ROOM_MANAGER: {
      return "ユーザ情報";
    }
    case NOTE_MANAGER: {
      return "共有メモ";
    }
    case CHANNEL_LIST: {
      return "チャンネル一覧";
    }
    case ISSUE_WRITER: {
      return "要望・バグ報告";
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

  static GetById({ id }: { id: number }): IFFloat | null {
    const instances: IFFloat[] = IFFloat.instances;
    return instances.find((i: IFFloat) => i.id === id) || null;
  }

  constructor(contentId: string, show?: boolean, args?: any) {
    const singleton = singletonList.indexOf(contentId) !== -1;
    const t = IFFloat.instances.find(t => t.contentId === contentId);
    if (singleton && t) {
      t.args = args;
      IFFloat.Pop(t.id);
      return t;
    }

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

  static Export() {
    const jsonObj = IFFloat.ToJSON();
    const json = JSON.stringify(jsonObj);
    this.ToLS(json);
  }

  static ToJSON() {
    const { instances = [] } = IFFloat;
    const floats = [];
    for (let i = 0; i < instances.length; i++) {
      const float = instances[i];

      /* 非表示のfloatは無視 */
      if (!float.show) {
        continue;
      }
      /* 初期表示可能なもののみ */
      if (startUpList.indexOf(float.contentId) === -1) {
        continue;
      }
      floats.push(float.toJSON());
    }
    return { floats };
  }

  static ToLS(json: string) {
    window.localStorage.setItem("config", json);
  }

  toJSON() {
    const id = this.id;
    const contentId = this.contentId;
    const contentTitle = this.contentTitle;
    const x = this.x;
    const y = this.y;
    const z = this.z;
    const w = this.w;
    const h = this.h;
    const args = this.args;
    return {
      id,
      show: true,
      contentId,
      contentTitle,
      x,
      y,
      z,
      w,
      h,
      args
    };
  }

  static Import() {
    const { floats: configList = [] } = IFFloat.FromLS();
    const floatList = [];
    const m = new Map();
    for (let i = 0; i < configList.length; i++) {
      const config = configList[i];
      if (m.has(config.id)) {
        continue;
      }
      m.set(config.id, config.id);
      const float = new IFFloat(config.contentId, true, config.args);
      float.id = config.id;
      float.contentTitle = config.contentTitle;
      float.x = config.x;
      float.y = config.y;
      float.z = config.z;
      float.w = config.w;
      float.h = config.h;
      floatList.push(float);
    }
    IFFloat.ReloadId();

    return floatList;
  }

  static FromLS() {
    const json = window.localStorage.getItem("config");
    return JSON.parse(json || "{}");
  }

  static ReloadId() {
    const { instances = [] } = IFFloat;
    if (!instances.length) {
      IFFloat.Id = 1;
    } else {
      const highest = instances.reduce((a, b) => (a.id > b.id ? a : b));
      IFFloat.Id = (highest?.id ?? 0) + 1;
    }
  }

  dispose() {
    IFFloat.instances.splice(IFFloat.instances.indexOf(this), 1);
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

  static Reset() {
    const { instances = [] } = IFFloat;
    for (let i = 0; i < instances.length; i++) {
      const float = instances[i];
      float.show = true;
      float.x = 100 + i * 20;
      float.y = 100 + i * 20;
      float.z = i + 1;
      float.w = 300;
      float.h = 200;
    }
  }
}
