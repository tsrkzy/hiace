/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { writable } from "svelte/store";
import { Notice } from "../Notice";

const notices = writable<Notice[]>([]);

notices.subscribe(nList => {
  console.log("notices.subscribe", nList);
});

export const useNotices = () => {
  return {
    subscribe: notices.subscribe,
    setNotices: notices.set,
    notices,
    addNotice: (notice: Notice) => {
      notices.update(nList => {
        return [...nList, notice];
      });
    },
    removeNotice: (id: number) => {
      notices.update(nList => {
        return nList.filter(n => n.id !== id);
      });
    },
  };
};
