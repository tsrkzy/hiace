<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div
    :id="`chat-list--scroll-parent__${floatId}`"
    style="width: 100%;height: calc( 100% - 60px );background-color: white; overflow-y: scroll;overflow-x: hidden;"
  >
    <ol
      :id="`chat-list--scroll-content__${floatId}`"
      style="margin:0;padding: 0;"
    >
      <chat-row
        :chat-id="c"
        v-for="(c, i) of chatIdList"
        :key="c"
        :dim="dim(i)"
      >
      </chat-row>
    </ol>
  </div>
</template>
<script>
import { SYSTEM } from "@/collections/Chat";
import ChatRow from "@/components/organisms/Float/FloatContents/ChatList/ChatRow";

export default {
  name: "chat-log-viewer",
  components: { ChatRow },
  props: {
    floatId: { type: Number, require: true },
    channelId: { type: String, require: true }
  },
  methods: {
    showNew() {
      const $parent = document.getElementById(
        `chat-list--scroll-parent__${this.floatId}`
      );
      $parent.scrollTo({
        top: $parent.scrollHeight - $parent.clientHeight,
        left: 0,
        behavior: "smooth"
      });
    },
    dim(index) {
      const chatList = this.$store.getters["chat/info"];
      const { channel, type } = chatList[chatList.length - (1 + index)];
      return type !== SYSTEM && channel !== this.channelId;
    }
  },
  computed: {
    chatIdList() {
      const chatList = this.$store.getters["chat/info"].map(c => c.id);
      return chatList.reverse();
    }
  },
  watch: {
    async chatIdList() {
      /* チャットが作成されるまで待機 */
      await this.$nextTick();
      this.showNew();
    }
  }
};
</script>
