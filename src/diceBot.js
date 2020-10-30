/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import axios from "axios";
import qs from "qs";

const config = {
  baseURL: "https://bcdice.onlinesession.app/v1/",
  timeout: 1000
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
