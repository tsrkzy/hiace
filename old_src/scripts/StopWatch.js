/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

"use strict";

/**
 * const sw = StopWatch.start("fileName.methodName");
 *   // do stuff
 * sw.stop();
 */
export class StopWatch {
  name = "";
  startTime = null;
  quiet = false;

  constructor(name = "") {
    this.name = name;
  }

  static start(name = "") {
    return new StopWatch(name).start();
  }

  start() {
    this.startTime = new Date().getTime();
    return this;
  }

  stop() {
    const finishTime = new Date().getTime();
    const result = StopWatch.format(finishTime - this.startTime);
    !this.quiet && console.log(`${this.name}: ${result}`);
  }

  static format(milliseconds) {
    if (milliseconds < 1000) {
      return `${milliseconds}[ms]`;
    } else {
      return `${Math.floor(milliseconds / 1000)}.${milliseconds % 1000}[sec]`;
    }
  }
}
