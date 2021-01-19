<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div class="chat-log-viewer__wrapper">
    <div
      :id="`chat-list--scroll-parent__${floatId}`"
      :class="{ onBottom, scrollParent: true }"
      @scroll="onScroll"
    >
      <chat-row ref="p" :float-id="floatId"></chat-row>
    </div>
    <div v-if="!onBottom" class="scroll-to-top__button" @click="onScrollButton">
      <a>scroll to top{{ read ? "" : " (new message there)" }}</a>
    </div>
  </div>
</template>
<script>
import ChatRow from "@/components/organisms/Float/FloatContents/ChatList/ChatRow";

const SCROLL_MARGIN = 40;

const chatMap = new Map();

export default {
  name: "chat-log-viewer",
  components: { ChatRow },
  props: {
    floatId: { type: Number, require: true },
    channelId: { type: String, require: true }
  },
  mounted() {
    const chatList = this.chatList;
    const channel = this.channelId;
    this.$refs.p.exAdd(chatList, { channel, flush: true });
    this.showNew();
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
      if (this.onBottom) {
        this.read = true;
        this.showNew();
      } else {
        this.read = false;
      }
    },
    changeChannel() {
      const chatList = this.chatList;
      const channel = this.channelId;
      this.$refs.p.exAdd(chatList, { channel, flush: true });
      this.showNew();
    },
    onScroll(e) {
      const $parent = e.currentTarget;
      const { scrollTop, clientHeight, scrollHeight } = $parent;

      /* chatが追加された際、その分のスクロールが終わるまでの一瞬に未読表示が出てしまうので、余裕をもたせる */
      const onBottom = scrollTop >= scrollHeight - clientHeight - SCROLL_MARGIN;
      const onTop = scrollTop <= SCROLL_MARGIN;
      if (onBottom) {
        this.onBottomHandler();
      } else if (onTop) {
        this.onTopHandler();
      } else {
        this.onTop = false;
        this.onBottom = false;
      }
    },
    onBottomHandler() {
      if (this.onBottom) {
        return false;
      }
      console.log("ChatLogViewer.onBottomHandler"); // @DELETEME

      this.onTop = false;
      this.onBottom = true;

      /* 既読フラグをON */
      this.read = true;
    },
    onTopHandler() {
      if (this.onTop) {
        return false;
      }
      console.log("ChatLogViewer.onTopHandler"); // @DELETEME

      this.onTop = true;
      this.onBottom = false;
    },
    onScrollButton() {
      this.showNew();
    }
  },
  data() {
    return {
      /* スクロール位置が最下部からSCROLL_MARGIN px以内 */
      onBottom: true,
      /* !onBottomのタイミングでchatが追加された */
      read: true,
      /* 最後にbottomへ到達した際のchatId */
      bookmark: null,

      /* スクロール位置が最上部から */
      onTop: false
    };
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
        /* 追加差分 */
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
div.chat-log-viewer__wrapper {
  width: 100%;
  height: calc(100% - 82px);
}

div.scrollParent {
  width: 100%;
  height: 100%;
  background-color: floralwhite;
  overflow-y: scroll;
  overflow-x: hidden;

  &.onBottom {
    background-color: white;
  }
}

div.scroll-to-top__button {
  position: relative;
  bottom: 1rem;
  left: 0;
  width: calc(100% - 15px);
  background-color: dimgray;
  opacity: 0.8;
  color: white;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
}

ol {
  margin: 0;
  padding: 0;
}
</style>
