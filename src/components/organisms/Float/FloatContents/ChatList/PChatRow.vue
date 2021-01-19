<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <ol :id="`chat-list--scroll-content__${floatId}`">
    <!-- パフォーマンス対策のためPureJSで制御 -->
  </ol>
</template>

<script>
import { createChatRowDom } from "@/components/organisms/Float/FloatContents/ChatList/ChatRowHelper";

let _float_id;
const $$ol = () => {
  return document.getElementById(`chat-list--scroll-content__${_float_id}`);
};

export default {
  name: "PChatRow",
  props: {
    floatId: { type: Number, require: true }
  },
  created() {
    _float_id = this.floatId;
  },
  computed: {},
  methods: {
    exAdd(chatList = [], { channel = null, flush = false }) {
      console.log("PChatRow.exAdd", channel, flush); // @DELETEME
      const $ol = $$ol();
      if (flush) {
        $ol.innerHTML = "";
      }

      const $liList = [];
      for (let i = 0; i < chatList.length; i++) {
        const c = chatList[i];
        const $li = createChatRowDom(c, channel);
        $liList.push($li);
      }
      $ol.append(...$liList);
    }
  }
};
</script>

<style scoped></style>
