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
  { system: "SwordWorld2.5", name: "ソードワールド2.5" }
].map(g => ({ value: g.system, text: g.name }));

const config = {
  baseURL: "https://bcdice.onlinesession.app/v1/",
  timeout: 3000
};

const axios_instance = axios.create(config);

/**
 * @param system {string} ゲームシステム
 * @param command {string} コマンド文字列
 * @return {Promise<{result?: string, reason?: string, secret?: boolean, ok: boolean, dices:{faces:number, value:number}[]}>}
 */
export async function callDiceBot(system, command) {
  const qo = {
    system,
    command
  };
  const q = qs.stringify(qo);
  const r = await axios_instance.get(`/diceroll?${q}`);
  const { ok, result = "", dices = [], secret = false, reason = "" } = r.data;
  return {
    ok,
    result,
    dices,
    secret,
    reason
  };
}
