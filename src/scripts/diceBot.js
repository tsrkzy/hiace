/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import axios from "axios";
import qs from "qs";

export const GAME_SYSTEMS = [
  { system: "Cthulhu", name: "クトゥルフ神話TRPG" },
  { system: "Cthulhu7th", name: "新クトゥルフ神話TRPG" },
  { system: "Kamigakari", name: "神我狩" },
  { system: "SwordWorld", name: "ソードワールドRPG" },
  { system: "SwordWorld2.0", name: "ソードワールド2.0" },
  { system: "SwordWorld2.5", name: "ソードワールド2.5" },
].map((g) => ({ value: g.system, text: g.name }));

const config = {
  baseURL: "https://bcdice.onlinesession.app/v1/",
  timeout: 3000,
};

const axios_instance = axios.create(config);

/**
 * 簡易DiceBotコマンド判定: 任意の半角英数字記号の2文字以上の繰り返しで始まる文字列
 * @param {string} text
 * @return {boolean}
 */
export function easyDiceCheck(text) {
  const diceBotRegex = /^[a-zA-Z0-9!-/:-@¥[-`{-~]{2,}/;
  return diceBotRegex.test(text);
}

/**
 * @param system {string} ゲームシステム
 * @param command {string} コマンド文字列
 * @return {Promise<{result?: string, reason?: string, secret?: boolean, ok: boolean, dices:{faces:number, value:number}[]}>}
 */
export async function callDiceBot(system, command) {
  const qo = {
    system,
    command,
  };
  const q = qs.stringify(qo);
  const r = await axios_instance.get(`/diceroll?${q}`);
  const { ok, result = "", dices = [], secret = false, reason = "" } = r.data;
  return {
    ok,
    result,
    dices,
    secret,
    reason,
  };
}

/**
 * 試しにBCDice叩いて妥当なコマンドかチェックする
 * 200かつokが返ればtrue それ以外はfalse
 * @param {string} system
 * @param {string} command
 * @return {Promise<boolean>}
 */
export async function dryRun(system, command) {
  try {
    if (!easyDiceCheck(command)) {
      return false;
    }
    const { ok } = await callDiceBot(system, command);
    return ok;
  } catch (e) {
    return false;
  }
}
