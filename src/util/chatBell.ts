/*-----------------------------------------------------------------------------
 - Copyright (c) 2024.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { playAudio } from "@/util/audio";

export const chatBell = () => {
  const url = "/assets/sound/newChat/key_type_01.mp3";
  return playAudio(url)
    .then(() => console.log(`played ${url}`))
    .catch(e => console.error(e));
};