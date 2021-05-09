/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { SYSTEM_CHANNEL_ID } from "@/collections/Channel";
import { BOOL, INT, STR } from "@/collections/Column";
import { FLOAT_HELP_MESSAGES, IFFloat } from "@/interfaces/IFFloat";
import { HELP_MESSAGE } from "@/message";
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
  /* 同名のキャラクタがいなければそのまま */
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

/**
 * Excelで出力されがちな汚い長いテキストをきれいにする
 *
 * 1. 各行末の連続した半角空白、全角空白を全て削除する
 * 2. 半角空白、全角空白、半角二重引用符のみの行を削除する
 * 3. 3個以上連続する改行(\n)を改行2個に変換
 * @param nastyText {string}
 */
export function washExcelNastyText(nastyText) {
  const a1 = nastyText.replace(/[ 　]*\n/g, "\n");
  const a2 = a1.replace(/\n"/g, "\n");
  const a3 = a2.replace(/\n{3,}/g, "\n\n");
  const a4 = a3.replace(/^["\n\s]*/g, "");
  return a4;
}

export function tableCompare(vA, vB, config) {
  const { type, order: o } = config;
  const order = o === "asc" ? 1 : -1;
  let r = 0;
  switch (type) {
    case INT: {
      const a = isNaN(vA) ? 0 : vA;
      const b = isNaN(vB) ? 0 : vB;
      r = a > b ? 1 : -1;
      break;
    }
    case STR: {
      const a = !vA || !vA.trim() ? "" : vA.trim();
      const b = !vB || !vB.trim() ? "" : vB.trim();
      r = a > b ? 1 : -1;
      break;
    }
    case BOOL: {
      const a = !!vA;
      const b = !!vB;
      r = a > b ? 1 : -1;
      break;
    }
    default: {
      // do nothing
      r = 0;
    }
  }

  return r * order;
}

export function getHelpMessage(floatId) {
  const { contentId = null } = IFFloat.GetById({ id: floatId });
  if (!contentId) return "";

  const keys = FLOAT_HELP_MESSAGES[contentId];

  const textList = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const { header, content } = HELP_MESSAGE[key];
    const text = `[${header}]\n${content}\n`;
    textList.push(text);
  }
  return textList.join("\n");
}

/**
 * 文字列を受け取り、全て#に変換して返す
 * @param {string} sourceText チャット本文
 * @param {string} selectedChannel チャットウィンドウで選択中のチャンネル
 * @param {string} channel チャットが紐付いているチャンネル
 * @return {*}
 */
export function maskByChannel(sourceText = "", channel, selectedChannel) {
  if (channel === selectedChannel || channel === SYSTEM_CHANNEL_ID) {
    /* SYSTEMまたは現在選択中のチャンネルはマスクしない */
    return sourceText;
  }
  const mask = store.getters["localConfig/maskChannel"];
  const washed = sourceText.trim();
  return mask ? washed.replace(/[^\s]/g, "#") : washed;
}

export function ver() {
  const { VUE_APP_VERSION_STRING } = process.env;
  return VUE_APP_VERSION_STRING || "failed to get revision.";
}

/**
 * クエリパラメータ silent が指定されていればtrue
 * ?silent
 * ?silent=false
 *  → どちらもtrue
 * @return {boolean}
 */
export function isSilent() {
  const qs = location.search;
  const q = new URLSearchParams(qs);
  const qSilent = q.get("silent");
  return qSilent !== null;
}

export function nowDatetime() {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = d.getUTCMonth();
  const dd = d.getUTCDay();
  const hh = d.getUTCHours();
  const ii = d.getUTCMinutes();
  const ss = d.getUTCSeconds();
  return { yyyy, mm, dd, hh, ii, ss };
}
