/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { useCharacters } from "@/model/store/characters";
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

  function _next(postfix = "") {
    const i = LIST.indexOf(postfix);
    if (!postfix || i === -1) {
      return "A";
    }
    if (!LIST[i + 1]) throw new Error("implement error: out of range");
    return LIST[i + 1];
  }

  let p = m ? m[1] : "";
  try {
    for (let i = 0; i < 26; i++) {
      p = _next(p);
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

const LIST = new Array(26).fill(null).map((_, i) => {
  return String.fromCharCode(65 + i);
});

export function cleanText(str: string) {
  const lines = str.split("\n");
  const result = [];
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    line = line.replace(/[\s\t]+$/, "");

    result.push(line);
  }

  return result
    .join("\n")
    .replace(/^"/g, "") // ファイル先頭の二重引用符は削除
    .replace(/"[\s\t\n]*$/g, "") // ファイル末尾の二重引用符は削除
    .replace(/\n"/g, "\n") // 行頭の二重引用符を削除
    .replace(/"\n/g, "\n") // 行末の二重引用符を削除
    .replace(/\n{3,}/, "\n");
}

export function yyyymmdd() {
  const d = new Date();
  const yyyy = `${d.getFullYear()}`.padStart(4, "0");
  const mm = `${d.getMonth() + 1}`.padStart(2, "0");
  const dd = `${d.getDate()}`.padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}
