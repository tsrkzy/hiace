<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div :id="`chat-list--scroll-parent__${floatId}`">
    <p-chat-row ref="p" :float-id="floatId"></p-chat-row>
  </div>
</template>
<script>
import PChatRow from "@/components/organisms/Float/FloatContents/ChatList/PChatRow";

const chatMap = new Map();

export default {
  name: "chat-log-viewer",
  components: { PChatRow },
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
    addChat(chatList = []) {
      console.log("ChatLogViewer.addChat", chatList); // @DELETEME
      const channel = this.channelId;
      this.$refs.p.exAdd(chatList, { channel });
    },
    changeChannel() {
      const chatList = this.chatList;
      const channel = this.channelId;
      this.$refs.p.exAdd(chatList, { channel, flush: true });
    }
  },
  computed: {
    chatList() {
      return this.$store.getters["chat/info"];
    }
  },
  watch: {
    async chatList(newList) {
      const added = [];
      for (let i = 0; i < newList.length; i++) {
        const chat = newList[i];
        if (chatMap.has(chat.id)) {
          continue;
        }
        added.push(chat);
        chatMap.set(chat.id, chat.id);
      }

      this.addChat(added);
    },
    channelId() {
      this.changeChannel();
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
