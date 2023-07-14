/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import store from "@/store";

export class Smoke {
  static async on() {
    console.warn("Smoke.on"); // @DELETEME
    await store.dispatch("smoke/on");
  }

  static async off() {
    console.warn("Smoke.off"); // @DELETEME
    await store.dispatch("smoke/off");
  }
}
