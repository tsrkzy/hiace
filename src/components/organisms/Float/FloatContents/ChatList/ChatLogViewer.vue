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
      <ha-button v-if="!onBottom" @click="onClickScrollToBottom">↓</ha-button>
    </div>
    <div
      :id="`chat-list--scroll-parent__${floatId}`"
      :class="{ onBottom, scrollParent: true }"
      @scroll="onScroll"
    >
      <chat-row ref="p" :float-id="floatId" :font-size="fontSize"></chat-row>
    </div>
  </div>
</template>
<script>
import HaButton from "@/components/atoms/HaButton";
import HaSelect from "@/components/atoms/HaSelect";
import ChatRow from "@/components/organisms/Float/FloatContents/ChatList/ChatRow";
import { generateChatRowId } from "@/components/organisms/Float/FloatContents/ChatList/ChatRowHelper";

const SCROLL_MARGIN = 80;
const LPP = 200; // lines per page

export default {
  name: "chat-log-viewer",
  components: { HaButton, HaSelect, ChatRow },
  props: {
    floatId: { type: Number, require: true },
    channelId: { type: String, require: true },
    fontSize: { type: Number, default: 0 }
  },
  mounted() {
    const chatList = this.chatList;
    const channel = this.channelId;
    this.$refs.p.exAdd(chatList.slice(-LPP), { channel, flush: true });
    this.scroll();
  },
  methods: {
    scroll() {
      /* 最下部にスクロール */
      if (this.chatList.length === 0) {
        console.log("ChatLogViewer.scroll - no chat to scroll");
        return false;
      }

      const { id: chatId } = this.chatList[this.chatList.length - 1];
      const floatId = this.floatId;
      const chatRowId = generateChatRowId(floatId, chatId);
      const $cr = document.getElementById(chatRowId);
      if (!$cr) {
        console.warn(`cannot get element ${chatRowId}`); // @DELETEME
        return false;
      }

      $cr.scrollIntoView();
    },
    add(chatList = [], { flush = false } = {}) {
      const channel = this.channelId;
      this.$refs.p.exAdd(chatList, { channel, flush });
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
    onClickScrollToBottom() {
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
      /* コンポーネントのグローバルに配置すると、
       * 複数インスタンス化した場合に衝突するのでdataにぶら下げているだけ
       * VueはMapをreactiveにしない */
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
    characters() {
      return this.$store.getters["character/info"];
    },
    dragging() {
      const m = !!this.$store.getters["map/dragging"];
      const p = !!this.$store.getters["pawn/dragging"];
      const b = !!this.$store.getters["board/dragging"];
      const d = !!this.$store.getters["dice/dragging"];
      return m || p || b || d;
    },
    /**
     * ページング用のオブジェクトの配列を返す
     * chatId: ページングオブジェクトの中で最も新しいchat
     * value: 何ページ目か。先頭は0ページ目
     * text: ページング用セレクトボックスのラベル
     */
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
    chatList(newList) {
      /* chatMapを利用し、追加されたchatをaddedとして切り出す */
      const added = [];
      for (let i = 0; i < newList.length; i++) {
        const chat = newList[i];
        if (this.chatMap.has(chat.id)) {
          continue;
        }
        added.push(chat);
        this.chatMap.set(chat.id, chat.id);
      }

      if (this.page !== 0) {
        /* 先頭のページにいない場合は、既読フラグを折る */
        this.read = false;
      } else {
        /* 先頭のページにいる場合は追加でレンダリングし、最下部を読んでいる場合は自動でスクロール */
        this.add(added.slice(-LPP));
        if (this.onBottom) {
          this.read = true;
          this.scroll();
        }
      }
    },
    characters(_, old) {
      if (old.length !== 0) {
        /* 初回にキャラクタが読み込まれたら再描画する
         * それ以外のタイミングは無視
         * @SEE https://github.com/tsrkzy/hiace/issues/25 */
        return false;
      }
      const { chatList = [] } = this;
      this.add(chatList.slice(-LPP), { flush: true });
      this.pageSelect = "0";
      this.page = 0;
      this.scroll();
    },
    channelId() {
      /* 閲覧中のチャンネル(props.channelId)を変更したら、先頭のページに戻る */
      this.onChangePage("0");
    },
    dragging(isDragging) {
      if (isDragging) {
        return false;
      }

      /* ドラッグ終了時、最下部かつ既読フラグが立っている場合は最下部へスクロール */
      if (this.read && this.onBottom) {
        /* スクロール位置をvueのAPIを使用せずに制御しているため、ドラッグ時から復帰した時にスクロール位置がvueの記憶した位置になる */
        this.scroll();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
div.chat-log-viewer__wrapper {
  position: relative;
  width: 100%;
  height: calc(100% - 8rem);
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
