<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <ha-button @click="onCLick">チャットログ(未実装)</ha-button>
</template>
<script>
import { FSAlias } from "@/collections/Alias";
import { FSCharacter } from "@/collections/Character";
import { DICE } from "@/collections/Chat";
import { FSUser } from "@/collections/User";
import { Notify } from "@/scripts/Notify";
import store from "@/store";
import HaButton from "@/components/atoms/HaButton";

export default {
  name: "ChatDownloadButton",
  components: { HaButton },
  methods: {
    onCLick() {
      const jsonObj = aggregate();
      console.log(jsonObj); // @DELETEME
      Notify.Log("フォーマット悩んでて未実装。とりあえずconsoleに吐いたよ");
      console.log(
        "右クリック → Store as global variable → copy(temp1)でクリップボードにコピーしたりしなかったりしろ"
      ); // @DELETEME
    }
  }
};

function aggregate() {
  console.log("ChatDownloadButton.aggregate"); // @DELETEME
  const chatList = store.getters["chat/info"];
  const logs = [];
  for (let i = 0; i < chatList.length; i++) {
    const {
      alias,
      character,
      owner,
      value = {},
      /* chat.js: TEXT, SYSTEM, DICE */
      type
    } = chatList[i];
    const a = FSAlias.Who(alias);
    const c = FSCharacter.Who(character);
    const u = FSUser.Who(owner, true);
    const { result = "", text = "" } = value;
    const isDice = type === DICE;
    const t = isDice ? `${text} → ${result}` : text;
    /* 改行をエスケープシーケンスから文字列の"\n"へ */
    const tt = t.replace(/\n/g, "\\n");
    const l = `"${u}","${c}","${a}","${tt}"`;

    logs.push({
      user: u,
      character: c,
      alias: a,
      type,
      formatted: l,
      text,
      result
    });
  }
  return logs;
}
</script>
