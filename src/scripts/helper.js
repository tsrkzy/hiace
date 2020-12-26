/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import store from "@/store";

export const getName = (entity, id) => {
  if (!id) {
    return "";
  }

  const nameMap = store.getters[`${entity}/nameMap`];
  if (!nameMap) {
    throw new Error("implement error");
  }

  return nameMap[id] ?? "";
};
export const getMaskedAccountFromEmail = email => {
  const account = email.substring(0, email.indexOf("@"));
  return Array.from(account)
    .map((s, i) => {
      return i % 4 < 2 ? s : "_";
    })
    .join("");
};
