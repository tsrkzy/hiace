/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import store from "@/store";
import d1 from "@/sound/newChat/key_type_01.mp3";
import d2 from "@/sound/newChat/key_type_02.mp3";

window.addEventListener("blur", doorBell, false);
window.addEventListener("focus", doorBell, false);

async function doorBell(e) {
  const { type } = e;
  if (type === "blur") {
    await store.dispatch("room/windowBlur");
  } else if (type === "focus") {
    await store.dispatch("room/windowFocus");
  }
}

export function ring() {
  const enable = store.getters["localConfig/ring"];
  if (!enable) {
    return false;
  }

  /* 0〜1 */
  const i = Math.floor(Math.random() * 2);
  const d = [d1, d2][i];
  const $a = new Audio(d);

  /* キータイプ音が地味なのでやや強め */
  $a.volume = 0.5 + 0.3;
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
