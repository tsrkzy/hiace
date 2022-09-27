/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { FSAlias } from "@/collections/Alias";
import { SYSTEM_CHANNEL_ID } from "@/collections/Channel";
import { FSCharacter } from "@/collections/Character";
import { DICE } from "@/collections/Chat";
import { BOOL, INT, STR } from "@/collections/Column";
import { FSUser } from "@/collections/User";
import { createChatRowDom } from "@/components/organisms/Float/FloatContents/ChatList/ChatRowHelper";
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

export const extractAccountFromEmail = (email) => {
  return email.substring(0, email.indexOf("@"));
};

export const mask = (account) => {
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

export const postfix = (name) => {
  const characters = store.getters["character/info"];
  const nameMap = new Map(characters.map((c) => [c.name, true]));
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

export function toyyyymmddhhiissd(d) {
  if (!(d instanceof Date)) {
    console.error(d);
    throw new Error("d must be instance of Date");
  }

  const yyyy = `${d.getUTCFullYear()}`.padStart(4, "0");
  const mm = `${d.getUTCMonth()}`.padStart(2, "0");
  const dd = `${d.getUTCDay()}`.padStart(2, "0");
  const hh = `${d.getUTCHours()}`.padStart(2, "0");
  const ii = `${d.getUTCMinutes()}`.padStart(2, "0");
  const day = "日月火水木金土"[d.getDay()];
  return `${yyyy}/${mm}/${dd} ${hh}:${ii} (${day})`;
}

export function logToTsv() {
  console.log("ChatDownloadButton.logToTsv"); // @DELETEME
  const chatList = store.getters["chat/info"];
  const logs = [];
  for (let i = 0; i < chatList.length; i++) {
    const {
      alias,
      character,
      owner,
      value = {},
      /* chat.js: TEXT, SYSTEM, DICE */
      type,
    } = chatList[i];
    const a = alias ? FSAlias.Who(alias) : null;
    const c = character ? FSCharacter.Who(character) : null;
    const u = owner ? FSUser.Who(owner) : null;
    const { result = "", text = "" } = value;
    const isDice = type === DICE;
    const t = isDice ? `${text} → ${result}` : text;

    /* 改行をエスケープシーケンスから文字列の"\n"へ */
    const tt = t.replace(/\n/g, "\\n");

    /* タブを文字列の"\t"へ */
    const ttt = tt.replace(/\t/g, "\\t");

    const l = `"${u}"\t"${c}"\t"${a}"\t"${ttt}"`;

    logs.push({
      user: u,
      character: c,
      alias: a,
      type,
      formatted: l,
      text,
      result,
    });
  }

  return logs;
}

export function logToHtml() {
  console.log("helper.logToHtml");

  /* HTML HEAD BODY */
  const $html = document.createElement("HTML");
  const $head = document.createElement("HEAD");
  const $body = document.createElement("BODY");
  $html.setAttribute("lang", "ja");
  $html.append($head);
  $html.append($body);

  /* ルームへのリンク */
  const roomId = store.getters["room/info"].id;
  const roomName = store.getters["room/info"].name;
  const uri = `https://hiace-50544.web.app/r/${roomId}`;
  const $roomAnchor = document.createElement("A");
  $roomAnchor.setAttribute("href", uri);
  $roomAnchor.setAttribute("target", "_brank");
  $roomAnchor.textContent = `link: ${roomName} (${roomId})`;
  $body.append($roomAnchor);

  /* ログ */
  const $logHeader = document.createElement("h1");
  $logHeader.textContent = "セッション別ログ";
  $body.append($logHeader);
  const $logDetailList = createLogDetailDOM();
  $body.append(...$logDetailList);

  /* STYLE */
  const $style = document.createElement("STYLE");
  $style.setAttribute("rel", "stylesheet");
  const normalizeCssCdn =
    "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css";
  $style.setAttribute("href", normalizeCssCdn);
  $body.append($style);

  return $html.outerHTML;
}

function createLogDetailDOM() {
  const chatList = store.getters["chat/info"];
  const chunks = chatListToChunks(chatList);

  const detailsList = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const { timestamp: tsFrom } = chunk[0];
    const { timestamp: tsTo } = chunk[chunk.length - 1];

    const from = toyyyymmddhhiissd(new Date(tsFrom));
    const to = toyyyymmddhhiissd(new Date(tsTo));

    const $details = document.createElement("DETAILS");
    detailsList.push($details);
    const $summary = document.createElement("SUMMARY");
    $summary.textContent = `${from} 〜 ${to} (${chunk.length})`;
    $details.append($summary);

    const $ul = document.createElement("UL");
    for (let j = 0; j < chunk.length; j++) {
      const chat = chunk[j];
      const {
        /* id,*/
        alias,
        character,
        owner,
        value = {},
        type,
        /* ,color */
      } = chat;
      const a = alias ? FSAlias.Who(alias) : null;
      const c = character ? FSCharacter.Who(character) : null;
      const u = owner ? FSUser.Who(owner) : null;
      const { result = "", text = "" } = value;
      const isDice = type === DICE;
      const t = isDice ? `${text} → ${result}` : text;

      /* 改行をエスケープシーケンスから文字列の"\n"へ */
      const tt = t.replace(/\n/g, "\\n");

      /* タブを文字列の"\t"へ */
      const ttt = tt.replace(/\t/g, "\\t");

      const $li = createChatRowDom(chat);
      $li.style.listStyle = "none";

      const $p = document.createElement("P");
      $p.textContent = `${c}(${a}): ${ttt}`;
      $ul.append($li);
    }

    $details.append($ul);
  }

  return detailsList;
}

function chatListToChunks(chatList = []) {
  let lastTS = 0;
  const chunks = [];
  let chunk = [];
  for (let i = 0; i < chatList.length; i++) {
    const c = chatList[i];
    const { timestamp } = c;

    if (!lastTS) {
      chunk.push(c);
      lastTS = timestamp;
      continue;
    }

    if (timestamp - lastTS >= 1000 * 60 * 60 * 4) {
      /* 4h空いたら新しくchunkを作る */
      chunks.push(chunk);
      chunk = [];
    }

    chunk.push(c);
    lastTS = timestamp;

    /* 最新chunk */
    if (i === chatList.length - 1) {
      chunks.push(chunk);
    }
  }

  return chunks;
}
