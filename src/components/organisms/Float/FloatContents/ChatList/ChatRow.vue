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

export default {
  name: "ChatRow",
  props: {
    floatId: { type: Number, require: true }
  },
  computed: {},
  methods: {
    $ol() {
      return document.getElementById(
        `chat-list--scroll-content__${this.floatId}`
      );
    },
    exAdd(chatList = [], { channel = null, flush = false, eliminate = 0 }) {
      console.log("PChatRow.exAdd", channel, flush); // @DELETEME
      const $ol = this.$ol();
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

      if (eliminate && $ol.childElementCount > eliminate) {
        const deleteCount = $ol.childElementCount - eliminate;
        for (let i = 0; i < deleteCount; i++) {
          $ol.removeChild($ol.firstChild);
        }
      }
    }
  }
};
</script>

<style scoped></style>
