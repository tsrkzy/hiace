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

export const extractAccountFromEmail = email => {
  return email.substring(0, email.indexOf("@"));
};

export const mask = account => {
  return Array.from(account)
    .map((s, i) => {
      return i % 4 < 2 ? s : "#";
    })
    .join("");
};

export const isMacOS = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf("mac") > 0 && ua.indexOf("os") > 0;
};

export const postfix = name => {
  const characters = store.getters["character/info"];
  const nameMap = new Map(characters.map(c => [c.name, true]));
  /* 同名のキャラクターがいなければそのまま */
  if (!nameMap.has(name)) {
    return name;
  }

  const regexp = /_([A-Z])$/;
  let p, base;
  if (!regexp.test(name)) {
    p = "";
    base = name;
  } else {
    p = regexp.exec(name)[1];
    base = name.replace(regexp, "");
  }

  try {
    for (let i = 0; i < 26; i++) {
      p = next(p);
      const testName = `${base}_${p}`;
      if (nameMap.has(testName)) {
        continue;
      }
      return testName;
    }
  } catch (e) {
    console.error(e);
  }
  return name;
};

const LIST = new Array(26).fill(null).map((_, i) => {
  return String.fromCharCode(65 + i);
});

function next(postfix = "") {
  const i = LIST.indexOf(postfix);
  if (!postfix || i === -1) {
    return "A";
  }
  if (!LIST[i + 1]) throw new Error("implement error: out of range");
  return LIST[i + 1];
}
