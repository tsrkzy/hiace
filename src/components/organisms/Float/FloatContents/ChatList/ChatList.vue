<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%; height: 100%; overflow-y: scroll">
    <alias-board v-if="showAlias"></alias-board>
    <chat-log-viewer
      :float-id="floatId"
      :channel-id="channelId"
      :font-size="fontSize"
    />
    <fieldset>
      <legend>チャット設定</legend>
      <div style="white-space: nowrap">
        <character-switcher ref="cs" @changed="onChangeCS"></character-switcher>
        <ha-select label="チャンネル" :items="channelItems" v-model="channelId">
          <option selected :value="SYSTEM_CHANNEL_ID">全体</option>
        </ha-select>
        <ha-select
          label="ダイス"
          :items="diceBotItems"
          :value="diceSystem"
          @change="onChangeDice"
        >
        </ha-select>
        <ha-checkbox
          front-label
          label="立ち絵"
          v-model="showAlias"
        ></ha-checkbox>
        <span>サイズ{{ fontSize }}</span>
        <ha-button @click="onClickLarge">+</ha-button>
        <ha-button @click="onClickSmall">-</ha-button>
      </div>
      <div>
        <ha-textarea
          class="chat-list__textarea-wrapper"
          @keydown="onKeydown"
          v-model="chatText"
          rows="2"
          placeholder="enter: send / shift+enter: new line / arrow up: dice log"
        ></ha-textarea>
      </div>
      <on-type-indicator />
    </fieldset>
  </div>
</template>

<script>
import { FSAlias } from "@/collections/Alias";
import { FSChannel, SYSTEM_CHANNEL_ID } from "@/collections/Channel";
import { FSCharacter } from "@/collections/Character";
import { FSChat } from "@/collections/Chat";
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import HaCheckbox from "@/components/atoms/HaCheckbox";
import HaSelect from "@/components/atoms/HaSelect";
import HaTextarea from "@/components/atoms/HaTextarea";
import CharacterSwitcher from "@/components/molecules/CharacterSwitcher";
import AliasBoard from "@/components/organisms/Float/FloatContents/ChatList/AliasBoard";
import ChatLogViewer from "@/components/organisms/Float/FloatContents/ChatList/ChatLogViewer";
import OnTypeIndicator from "@/components/organisms/Float/FloatContents/ChatList/OnTypeIndicator";
import { GAME_SYSTEMS } from "@/scripts/diceBot";
import { ON_TYPE, Socket } from "@/scripts/Socket";

export default {
  name: "ChatList",
  components: {
    HaCheckbox,
    HaButton,
    OnTypeIndicator,
    AliasBoard,
    ChatLogViewer,
    HaTextarea,
    HaSelect,
    CharacterSwitcher,
  },
  props: {
    floatId: {
      type: Number,
      require: true,
    },
  },
  created() {},
  computed: {
    diceSystem() {
      return this.innerDiceSystem ?? this.$store.getters["room/gameSystem"];
    },
    channelItems() {
      return this.$store.getters["channel/info"].map((c) => ({
        text: c.name,
        value: c.id,
      }));
    },
    diceBotItems() {
      return GAME_SYSTEMS;
    },
    room() {
      return this.$store.getters["room/info"];
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    configSummary() {
      const { characterId, aliasId } = this;
      const u = FSUser.Who(this.user.id) ?? "";
      const c = FSCharacter.Who(characterId) ?? "";
      const a = FSAlias.Who(aliasId) ?? "";
      const ch = FSChannel.Who(this.channelId) ?? "";
      /*
       * speaker
       *   (${u}@PL)
       *   (${c}@${a})
       * to
       *   ${ch}
       *   ${talkee} // @TODO tell
       * */
      const speaker = c ? `(${c}@${a})` : `(${u}@PL)`;
      const to = ch ? ` → ${ch}` : ``;
      return `${speaker}${to}`;
    },
  },
  data() {
    return {
      SYSTEM_CHANNEL_ID,
      channelId: SYSTEM_CHANNEL_ID,
      innerDiceSystem: null,
      chatText: "",
      historyKey: -1,
      characterId: null,
      aliasId: null,
      showAlias: true,
      fontSize: 0,
    };
  },
  methods: {
    getSpeaker() {
      /* 子コンポーネントから選択中のcharacterとaliasを取得 */
      const { aliasId, characterId } = this.$refs.cs.getIdCharacterAndAlias();
      return { aliasId, characterId };
    },
    onChangeCS(speaker) {
      const { characterId, aliasId } = speaker;
      this.characterId = characterId;
      this.aliasId = aliasId;
    },
    onChangeDice(value) {
      console.log("ChatList.onChangeDice", value); // @DELETEME
      this.innerDiceSystem = value;
    },
    async sendChat() {
      console.log("DebugIndicator.sendChat"); // @DELETEME
      const { chatText: _chatText = "", channelId: channelId } = this;
      if (!channelId) {
        throw new Error("no channel found");
      }

      const { aliasId, characterId } = this.getSpeaker();
      const chatText = _chatText.trim();
      const roomId = this.room.id;
      const userId = this.user.id;
      const c = {
        room: roomId,
        channel: channelId,
        owner: userId,
        character: characterId,
        alias: aliasId,
        value: {
          text: chatText,
        },
      };
      this.chatText = "";
      try {
        await FSChat.Chat(c, this.diceSystem);
      } catch (e) {
        this.chatText = _chatText;
        console.error(e);
      }
    },
    sendChatter() {
      const { characterId } = this.getSpeaker();
      const userName = this.$store.getters["auth/user"].name;
      Socket.Send(ON_TYPE, { userName, characterId });
    },
    async onKeydown(e) {
      const { code, isComposing, shiftKey, currentTarget } = e;
      const { value: value = "", selectionStart } = currentTarget;

      const historyList = FSChat.LoadHistory();
      const historyLength = historyList.length;

      const firstLineLength = value.split("\n")[0].length;
      const caretOnFirstLine = selectionStart <= firstLineLength;

      const lowerCode = code.toLowerCase();
      if (
        !isComposing &&
        !shiftKey &&
        lowerCode === "arrowup" &&
        caretOnFirstLine &&
        historyLength !== 0
      ) {
        /* 変換中でなく、キャレットが文頭にある時にarrowupが入力された場合 */
        this.historyKey++;
        this.historyKey =
          this.historyKey >= historyLength ? 0 : this.historyKey;
        const history = historyList.find((h) => h.key === this.historyKey);
        if (history) {
          this.chatText = history.text;
          return false;
        }
      }

      /* ヒストリ呼出しでない or ヒストリがない場合はヒストリ参照をリセット */
      this.historyKey = -1;

      if (!isComposing && !shiftKey && lowerCode === "enter") {
        /* 変換中でない場合のEnter */
        e.preventDefault();
        await this.sendChat();
      }

      /* 〜が入力中 */
      this.sendChatter();
    },
    onClickLarge() {
      if (this.fontSize < 4) this.fontSize++;
    },
    onClickSmall() {
      if (this.fontSize > 0) this.fontSize--;
    },
  },
};
</script>
