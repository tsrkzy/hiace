<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <alias-board></alias-board>
    <chat-log-viewer :float-id="floatId" :channel-id="channelId" />
    <fieldset>
      <legend>チャット設定</legend>
      <div style="white-space: nowrap;">
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
      </div>
      <div>
        <ha-textarea
          class="chat-list__textarea-wrapper"
          @keydown="onKeydown"
          v-model="chatText"
          rows="2"
          placeholder="enter: send / shift+enter: new line"
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
import HaSelect from "@/components/atoms/HaSelect";
import HaTextarea from "@/components/atoms/HaTextarea";
import CharacterSwitcher from "@/components/molecules/CharacterSwitcher";
import AliasBoard from "@/components/organisms/Float/FloatContents/ChatList/AliasBoard";
import ChatLogViewer from "@/components/organisms/Float/FloatContents/ChatList/ChatLogViewer";
import OnTypeIndicator from "@/components/organisms/Float/FloatContents/ChatList/OnTypeIndicator";
import { GAME_SYSTEMS } from "@/scripts/diceBot";
import { Throttle } from "@/scripts/Throttle";

const throttle = new Throttle(1000);
export default {
  name: "ChatList",
  components: {
    OnTypeIndicator,
    AliasBoard,
    ChatLogViewer,
    HaTextarea,
    HaSelect,
    CharacterSwitcher
  },
  props: {
    floatId: {
      type: Number,
      require: true
    }
  },
  created() {},
  computed: {
    diceSystem() {
      return this.innerDiceSystem ?? this.$store.getters["room/gameSystem"];
    },
    channelItems() {
      return this.$store.getters["channel/info"].map(c => ({
        text: c.name,
        value: c.id
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
    }
  },
  data() {
    return {
      SYSTEM_CHANNEL_ID,
      channelId: SYSTEM_CHANNEL_ID,
      innerDiceSystem: null,
      chatText: "",
      characterId: null,
      aliasId: null
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
          text: chatText
        }
      };
      this.chatText = "";
      try {
        await FSChat.Chat(c, this.diceSystem);
      } catch (e) {
        this.chatText = _chatText;
        console.error(e);
      }
    },
    async onKeydown(e) {
      const { code, isComposing, shiftKey } = e;
      if (!isComposing && !shiftKey && code.toLowerCase() === "enter") {
        /* 変換中でない場合のEnter */
        e.preventDefault();
        await this.sendChat();
      }

      throttle
        .do()
        .then(() => {
          FSUser.Ping(this.user.id);
        })
        .catch(() => {});
    }
  }
};
</script>
