/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export const NUM_BOOL = {
  T: 1,
  F: 0,
} as const;
export type NUM_BOOL = (typeof NUM_BOOL)[keyof typeof NUM_BOOL];

/**
 * Chat一覧を開いた状態で新しく受信したChat を区別するためのClass
 */
export class ReadManager {
  static Get(chatId: string): boolean {
    return ReadManager.New().get(chatId);
  }

  private get(chatId: string): boolean {
    return !!this._db.get(chatId);
  }

  static Set(chatId: string) {
    ReadManager.New().set(chatId);
  }

  private set(chatId: string) {
    console.log("ReadManager.set", chatId);
    this._db.set(chatId, NUM_BOOL.T);
  }

  static Clear() {
    ReadManager.New().clear();
  }

  private clear() {
    this._db.clear();
  }

  private _db: Map<string, NUM_BOOL> = new Map<string, NUM_BOOL>();
  private static _i: ReadManager;

  static New(chatIdList: string[] = []): ReadManager {
    return new ReadManager(chatIdList);
  }

  private constructor(chatIdList: string[]) {
    if (ReadManager._i) {
      return ReadManager._i;
    }

    this._db = new Map(chatIdList.map(i => [i, NUM_BOOL.T]));
    ReadManager._i = this;
  }
}
