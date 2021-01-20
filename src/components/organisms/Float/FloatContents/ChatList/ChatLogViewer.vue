<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div class="chat-log-viewer__wrapper">
    <div class="scroll-upper__button">
      <ha-select
        :items="pagingItems"
        v-model="pageSelect"
        @change="onChangePage"
      >
        <option disabled value="-1">ページ移動</option>
      </ha-select>
    </div>
    <div v-if="!onBottom || !read" class="scroll-bottom__button">
      <ha-button v-if="!read" @click="onClickPageZero"
        >トップへ{{ read ? "" : " (未読あり)" }}</ha-button
      >
      <ha-button v-if="!onBottom" @click="onClickScroll">↓</ha-button>
    </div>
    <div
      :id="`chat-list--scroll-parent__${floatId}`"
      :class="{ onBottom, scrollParent: true }"
      @scroll="onScroll"
    >
      <chat-row ref="p" :float-id="floatId"></chat-row>
    </div>
  </div>
</template>
<script>
import HaButton from "@/components/atoms/HaButton";
import HaSelect from "@/components/atoms/HaSelect";
import ChatRow from "@/components/organisms/Float/FloatContents/ChatList/ChatRow";

const SCROLL_MARGIN = 40;
const LPP = 200; // lines per page

export default {
  name: "chat-log-viewer",
  components: { HaButton, HaSelect, ChatRow },
  props: {
    floatId: { type: Number, require: true },
    channelId: { type: String, require: true }
  },
  mounted() {
    const chatList = this.chatList;
    const channel = this.channelId;
    this.$refs.p.exAdd(chatList.slice(-LPP), { channel, flush: true });
    this.scroll();
  },
  methods: {
    scroll({ top = false, rough = false } = {}) {
      const $parent = document.getElementById(
        `chat-list--scroll-parent__${this.floatId}`
      );
      $parent.scrollTo({
        top: top ? 0 : $parent.scrollHeight - $parent.clientHeight,
        left: 0,
        behavior: rough ? "auto" : "smooth"
      });
    },
    add(chatList = [], { flush = false, eliminate = false }) {
      console.log("ChatLogViewer.add", chatList); // @DELETEME
      const channel = this.channelId;
      this.$refs.p.exAdd(chatList, { channel, flush, eliminate });
    },
    onScroll(e) {
      const $parent = e.currentTarget;
      const { scrollTop, clientHeight, scrollHeight } = $parent;

      /* chatが追加された際、その分のスクロールが終わるまでの一瞬に未読表示が出てしまうので、余裕をもたせる */
      const onBottom = scrollTop >= scrollHeight - clientHeight - SCROLL_MARGIN;
      if (onBottom) {
        this.onBottomHandler();
      } else {
        this.onBottom = false;
      }
    },
    onBottomHandler() {
      this.onBottom = true;
      if (this.page === 0) {
        this.read = true;
      }
    },
    onClickPageZero() {
      this.onChangePage("0");
      this.read = true;
      this.onBottom = true;
    },
    onClickScroll() {
      this.scroll();
    },
    onChangePage(pageIndexStr) {
      this.pageSelect = pageIndexStr;
      this.page = parseInt(pageIndexStr, 10);
      let chatId = this.pagingItems[this.page]?.chatId;

      if (!chatId) {
        console.error(`invalid pageIndex: ${this.page}`);
        chatId = this.chatList[this.chatList.length - 1].id;
        this.page = 0;
      }

      const chatList = this.chatList;
      const index = chatList.findIndex(c => c.id === chatId);

      const to = index + 1;
      const from = to - LPP < 0 ? 0 : to - LPP;
      const slice = chatList.slice(from, to);

      this.add(slice, { flush: true });
      this.scroll();
    }
  },
  data() {
    return {
      chatMap: new Map(),
      /* スクロール位置が最下部からSCROLL_MARGIN px以内 */
      onBottom: true,
      /* !onBottomのタイミングでchatが追加された */
      read: true,
      /* ページングセレクタの制御用 */
      pageSelect: "0",
      /* ページング */
      page: 0
    };
  },
  computed: {
    chatList() {
      return this.$store.getters["chat/info"];
    },
    pagingItems() {
      const chatList = this.chatList;
      const items = [];
      /* ※ datetime.ascなので先頭ほど古い */
      for (let i = 0; i < chatList.length; i += LPP) {
        const j = Math.max(chatList.length - (i + 1), 0);
        const c = chatList[j];
        const p = {
          chatId: c.id,
          value: `${i / LPP}`,
          text: `${i}〜${i + LPP}${i === 0 ? "(最新)" : ""}`
        };
        items.push(p);
      }
      return items;
    }
  },
  watch: {
    async chatList(newList) {
      console.log("ChatLogViewer.watch->chatList"); // @DELETEME
      const added = [];
      for (let i = 0; i < newList.length; i++) {
        const chat = newList[i];
        if (this.chatMap.has(chat.id)) {
          continue;
        }
        /* 追加差分 */
        added.push(chat);
        this.chatMap.set(chat.id, chat.id);
      }

      if (this.page !== 0) {
        this.read = false;
      } else {
        const eliminate = this.onBottom ? LPP : 0;
        this.add(added.slice(-LPP), { eliminate });
        if (this.onBottom) {
          this.read = true;
          this.scroll();
        }
      }
    },
    channelId() {
      this.onChangePage("0");
    }
  }
};
</script>
<style lang="scss" scoped>
div.chat-log-viewer__wrapper {
  position: relative;
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

div.scroll-upper__button {
  position: absolute;
  top: 0;
  right: 15px;
  background-color: dimgray;
}

div.scroll-bottom__button {
  position: absolute;
  bottom: 0;
  right: 15px;
  background-color: dimgray;
}

ol {
  margin: 0;
  padding: 0;
}
</style>
