/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { writable } from "svelte/store";
import { LocalConfig } from "@/model/LocalConfig";

const localConfig = writable<LocalConfig>(
  new LocalConfig(JSON.parse(localStorage.getItem("localConfig") || "{}")),
);

const updateLocalStorage = (l: LocalConfig) => {
  console.log("localConfig.updateLocalStorage", l);
  localStorage.setItem("localConfig", l.toJSONStr());
};

localConfig.subscribe((l: LocalConfig) => {
  console.log("localConfig.subscribe", l);
  updateLocalStorage(l);
});

const setIsRing = (isRing: boolean) => {
  localConfig.update(l => {
    l.isRing = isRing;
    return l;
  });
};
const setIsBackGround = (isBackGround: boolean) => {
  localConfig.update(l => {
    l.isBackGround = isBackGround;
    return l;
  });
};

export const useLocalConfig = () => {
  return {
    localConfig,
    setLocalConfig: localConfig.set,
    setIsRing,
    setIsBackGround,
  };
};
