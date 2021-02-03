/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import store from "@/store";

export class Notify {
  static id = 0;
  level = 0;
  text = "";

  static GetId() {
    const id = Notify.id;
    Notify.id++;
    return id;
  }

  static Log(text) {
    const notice = new Notify(text, 0);
    const { id } = notice;
    store.dispatch("notice/add", { notice });
    window.setTimeout(() => {
      console.log("Notify.delete"); // @DELETEME
      store.dispatch("notice/delete", { id });
    }, 4000);
  }
  constructor(text, level) {
    this.id = Notify.GetId();
    this.text = text;
    this.level = level;
  }
}
