/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import store from "@/store";

export class Smoke {
  static async on() {
    await store.dispatch("smoke/on");
  }

  static async off() {
    await store.dispatch("smoke/off");
  }
}
