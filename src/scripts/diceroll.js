/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import d01 from "@/sound/dice/dice_01.mp3";
import d02 from "@/sound/dice/dice_02.mp3";
import d03 from "@/sound/dice/dice_03.mp3";
import d04 from "@/sound/dice/dice_04.mp3";
import d05 from "@/sound/dice/dice_05.mp3";

export function diceroll() {
  /* 0〜4 */
  const i = Math.floor(Math.random() * 5);
  const d = [d01, d02, d03, d04, d05][i];
  const $a = new Audio(d);
  $a.volume = 0.5;
  $a.oncanplaythrough = async () => {
    $a.oncanplaythrough = null;
    await $a.play();
  };

  $a.onerror = e => {
    $a.error = null;
    console.error(e);
    throw new Error(`failed to load sound: ${this.soundId}`);
  };

  $a.onpause = () => {
    $a.onpause = null;
  };

  $a.onended = () => {
    $a.onended = null;
  };

  $a.load();
}
