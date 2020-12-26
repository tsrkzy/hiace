<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <div
      :id="`chat-list--scroll-parent__${floatId}`"
      style="width: 100%;height: calc( 100% - 60px );background-color: tan; overflow-y: scroll;overflow-x: hidden;"
    >
      <ol
        :id="`chat-list--scroll-content__${floatId}`"
        style="margin:0;padding: 0;"
      >
        <li
          v-for="c of chatItems"
          :key="c.id"
          style="margin: 0;word-break: break-word;"
        >
          <span
            >({{ getChannelName(c) || "none" }})
            {{ getCharacterName(c) || getUserName(c)
            }}{{ c.alias ? `(${getAliasName(c)})` : "" }}:
            {{
              c.type === "DICE"
                ? c.value.result
                : c.value.text.replace("\n", "\\n") /* @TODO */
            }}</span
          >
        </li>
      </ol>
    </div>
    <div style="width: 100%;height: 60px;">
      <character-switcher ref="cs"></character-switcher>
      <ha-select label="ch:" :items="channelItems" v-model="channelIdChatTo">
        <option selected :value="SYSTEM_CHANNEL_ID">全体</option>
      </ha-select>
      <ha-select label="dice:" :items="diceBotItems" v-model="diceSystem">
      </ha-select>
      <ha-textarea
        @keydown="onKeydown"
        v-model="chatText"
        rows="2"
        :resizeable="false"
        placeholder="enter: send / shift+enter: new line"
      ></ha-textarea>
      <ha-button @click="sendChat">send</ha-button>
    </div>
  </div>
</template>

<script>
import { FSAlias } from "@/collections/Alias";
import { FSChannel, SYSTEM_CHANNEL_ID } from "@/collections/Channel";
import { FSCharacter } from "@/collections/Character";
import { FSChat } from "@/collections/Chat";
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import HaSelect from "@/components/atoms/HaSelect";
import HaTextarea from "@/components/atoms/HaTextarea";
import CharacterSwitcher from "@/components/molecules/CharacterSwitcher";
import { GAME_SYSTEMS } from "@/scripts/diceBot";
import { Throttle } from "@/scripts/Throttle";

const throttle = new Throttle(1000);
export default {
  name: "ChatList",
  components: {
    HaTextarea,
    HaButton,
    HaSelect,
    CharacterSwitcher
  },
  props: {
    floatId: {
      type: Number,
      require: true
    }
  },
  computed: {
    chatItems() {
      const chatList = this.$store.getters["chat/info"].slice();
      return chatList.reverse();
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
    }
  },
  data() {
    return {
      SYSTEM_CHANNEL_ID,
      channelIdChatTo: SYSTEM_CHANNEL_ID,
      diceSystem: null,
      chatText: ""
    };
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
    getSpeaker() {
      const { aliasId, characterId } = this.$refs.cs.getIdCharacterAndAlias();
      return { aliasId, characterId };
    },
    async sendChat() {
      console.log("DebugIndicator.sendChat"); // @DELETEME
      const { chatText: _chatText = "", channelIdChatTo: channelId } = this;
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
      await FSChat.Chat(c, this.diceSystem);

      this.chatText = "";
    },
    async onKeydown(e) {
      const { code, isComposing, shiftKey } = e;
      if (!isComposing && !shiftKey && code.toLowerCase() === "enter") {
        /* 変換中でない場合のEnter */
        await this.sendChat();
      }

      throttle
        .do()
        .then(() => {
          FSUser.Ping(this.user.id);
        })
        .catch(() => {});
    },
    getChannelName(chatItem) {
      const { channel } = chatItem;
      return FSChannel.Who(channel) || "全体";
    },
    getCharacterName(chatItem) {
      const { character } = chatItem;
      return FSCharacter.Who(character);
    },
    getAliasName(chatItem) {
      const { alias } = chatItem;
      return FSAlias.Who(alias);
    },
    getUserName(chatItem) {
      const { owner } = chatItem;
      return FSUser.Who(owner);
    }
  },
  watch: {
    async chatItems() {
      /* チャットが作成されるまで待機 */
      await this.$nextTick();
      this.showNew();
    }
  }
};
</script>

<style scoped></style>
