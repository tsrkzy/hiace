<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div :id="`chat-list--scroll-parent__${floatId}`">
    <ol :id="`chat-list--scroll-content__${floatId}`">
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
import { StopWatch } from "@/scripts/StopWatch";

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
      /* @SAFE */
      return this.$store.getters["chat/info"].map(c => c.id);
    }
  },
  watch: {
    async chatIdList() {
      const sw = StopWatch.start("ChatLogViewer.chatIdList");
      /* チャットが作成されるまで待機 */
      /* @HEAVY */
      await this.$nextTick();
      sw.stop();
      this.showNew();
    }
  }
};
</script>
<style lang="scss" scoped>
div {
  width: 100%;
  height: calc(100% - 82px);
  background-color: white;
  overflow-y: scroll;
  overflow-x: hidden;
}
ol {
  margin: 0;
  padding: 0;
}
</style>
