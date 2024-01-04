/*-----------------------------------------------------------------------------
 - Copyright (c) 2024.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { useLocalConfig } from "@/model/store/localConfig";
import { get } from "svelte/store";

export const onBlur = () => {
  const { setIsBackGround } = useLocalConfig();
  setIsBackGround(true);
};
export const onFocus = () => {
  const { setIsBackGround } = useLocalConfig();
  setIsBackGround(false);
};

window.addEventListener("blur", onBlur, false);
window.addEventListener("focus", onFocus, false);

export const playAudio = async (fileUrl: string) => {
  const { localConfig } = useLocalConfig();
  const { isBackGround, isRing } = get(localConfig);

  if (!isBackGround || !isRing) {
    console.info("chat bell skipped"); // @DELETEME
    return;
  }

  const audio = new Audio(fileUrl);
  audio.volume = 1.0;
  audio.addEventListener("canplaythrough", async () => {
    const onError = () => {
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
    };
    const onEnded = () => {
      console.log("chat bell played.");
      audio.removeEventListener("error", onError);
      audio.removeEventListener("ended", onEnded);
    };
    audio.addEventListener("error", onError, false);
    audio.addEventListener("ended", onEnded, false);
    await audio.play();
  });

  audio.load();
};
