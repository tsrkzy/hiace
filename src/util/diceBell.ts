/*-----------------------------------------------------------------------------
 - Copyright (c) 2024.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { playAudio } from "@/util/audio";

export const diceBell = () => {
  const url = "/assets/sound/dice/dice_01.mp3";
  return playAudio(url)
    .then(() => console.log(`played ${url}`))
    .catch(e => console.error(e));
};
