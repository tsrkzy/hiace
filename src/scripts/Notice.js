/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import store from "@/store";

export class Notice {
  static id = 0;
  level = 0;
  text = "";

  static GetId() {
    const id = Notice.id;
    Notice.id++;
    return id;
  }

  static Log(text) {
    console.log("Notice.Log"); // @DELETEME
    const notice = new Notice(text, 0);
    const { id } = notice;
    store.dispatch("notice/add", { notice });
    window.setTimeout(() => {
      console.log("Notice.delete"); // @DELETEME
      store.dispatch("notice/delete", { id });
    }, 4000);
  }
  constructor(text, level) {
    this.id = Notice.GetId();
    this.text = text;
    this.level = level;
  }
}
