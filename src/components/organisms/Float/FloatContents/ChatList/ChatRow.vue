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
const LPP = 200;

export default {
  name: "ChatRow",
  props: {
    floatId: { type: Number, require: true }
  },
  computed: {},
  methods: {
    $ol() {
      const f = this.floatId;
      return document.getElementById(`chat-list--scroll-content__${f}`);
    },
    /**
     * チャットログのDOMを追加(または洗い替え)でレンダリングし、ページごとの最大表示数に合わせて古い順にDOMを削除する。
     * @param chatList
     * @param channel {?string}
     * @param flush {?boolean} 描画済みのチャットログを削除してから描画を行う
     */
    exAdd(chatList = [], { channel = null, flush = false }) {
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

      if ($ol.childElementCount > LPP) {
        const deleteCount = $ol.childElementCount - LPP;
        for (let i = 0; i < deleteCount; i++) {
          $ol.removeChild($ol.firstChild);
        }
      }
    }
  }
};
</script>

<style scoped></style>
