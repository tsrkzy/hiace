<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <span>
    <ha-button @click="onCLickTsv">TSV</ha-button>
    <ha-button @click="onCLickHtml">HTML</ha-button>
  </span>
</template>
<script>
import { logToHtml, logToTsv, nowDatetime } from "@/scripts/helper";
import store from "@/store";
import HaButton from "@/components/atoms/HaButton";

export default {
  name: "ChatDownloadButton",
  components: { HaButton },
  methods: {
    onCLickTsv() {
      const textList = logToTsv();
      downloadAsTsv(textList);
    },
    onCLickHtml() {
      const html = logToHtml();
      downloadAsHtml(html);
    }
  }
};

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

function downloadAsHtml(html = "") {
  const roomId = store.getters["room/info"].id;
  const { yyyy, mm, dd, hh, ii, ss } = nowDatetime();
  const timestamp = `${yyyy}-${mm}-${dd}-${hh}-${ii}-${ss}`;
  const blob = new Blob([html], { type: "text/html" });
  const $a = document.createElement("A");
  $a.href = URL.createObjectURL(blob);
  $a.setAttribute("download", `${roomId}_${timestamp}.html`);

  $a.dispatchEvent(new MouseEvent("click"));
}
</script>
