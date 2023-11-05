/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { writable } from "svelte/store";
import { LocalConfig } from "../LocalConfig";

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

export const useLocalConfig = () => {
  return {
    setLocalConfig: localConfig.set,
    localConfig,
  };
};
