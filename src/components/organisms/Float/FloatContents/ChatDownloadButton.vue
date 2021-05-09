<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <span>
    <ha-button @click="onCLick">TSV</ha-button>
  </span>
</template>
<script>
import { FSAlias } from "@/collections/Alias";
import { FSCharacter } from "@/collections/Character";
import { DICE } from "@/collections/Chat";
import { FSUser } from "@/collections/User";
import { nowDatetime } from "@/scripts/helper";
import store from "@/store";
import HaButton from "@/components/atoms/HaButton";

export default {
  name: "ChatDownloadButton",
  components: { HaButton },
  methods: {
    onCLick() {
      const textList = aggregate();
      downloadAsTsv(textList);
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
      result
    });
  }

  return logs;
}

function downloadAsTsv(textList = []) {
  const roomId = store.getters["room/info"].id;
  const { yyyy, mm, dd, hh, ii, ss } = nowDatetime();
  const timestamp = `${yyyy}-${mm}-${dd}-${hh}-${ii}-${ss}`;
  const text = textList.map(t => t.formatted).join("\n");
  const blob = new Blob([text], { type: "text/tsv" });
  const $a = document.createElement("A");
  $a.href = URL.createObjectURL(blob);
  $a.setAttribute("download", `${roomId}_${timestamp}.tsv`);

  $a.dispatchEvent(new MouseEvent("click"));
}
</script>
