/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { useCharacters } from "../model/store/characters";
import { get } from "svelte/store";

export const postfix = (name: string) => {
  const { characters } = useCharacters();
  const characterList = get(characters);
  const nameList = characterList.map(c => c.name);

  /* 同名のキャラクタがいなければそのまま */
  if (!nameList.includes(name)) {
    return name;
  }

  const regexp = /_([A-Z])$/;

  const m = regexp.exec(name);
  const base = m ? name.replace(regexp, "") : name;

  let p = m ? m[1] : "";
  try {
    for (let i = 0; i < 26; i++) {
      p = next(p);
      const testName = `${base}_${p}`;
      if (nameList.includes(testName)) {
        continue;
      }
      return testName;
    }
  } catch (e) {
    console.error(e);
  }
  return name;
};

function next(postfix = "") {
  const i = LIST.indexOf(postfix);
  if (!postfix || i === -1) {
    return "A";
  }
  if (!LIST[i + 1]) throw new Error("implement error: out of range");
  return LIST[i + 1];
}

const LIST = new Array(26).fill(null).map((_, i) => {
  return String.fromCharCode(65 + i);
});
