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
      style="width: 100%;height: calc( 100% - 60px );background-color: tan; overflow: scroll;"
    >
      <ol :id="`chat-list--scroll-content__${floatId}`" style="margin:0;">
        <li
          v-for="c of chatItems"
          :key="c.id"
          style="margin: 0;    word-break: break-all;
    white-space: nowrap;"
        >
          ({{ c.channel || "none" }}) {{ c.character || userName
          }}{{ c.alias ? `(${c.alias})` : "" }}:
          {{ c.type === "DICE" ? c.value.result : c.value.text }}
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
      <ha-input-form @keydown="onKeydown" v-model="chatText"></ha-input-form>
      <ha-button @click="sendChat">send</ha-button>
    </div>
  </div>
</template>

<script>
import { SYSTEM_CHANNEL_ID } from "@/collections/Channel";
import { FSChat } from "@/collections/Chat";
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import HaInputForm from "@/components/atoms/HaInputForm";
import HaSelect from "@/components/atoms/HaSelect";
import CharacterSwitcher from "@/components/molecules/CharacterSwitcher";
import { GAME_SYSTEMS } from "@/scripts/diceBot";
import { Throttle } from "@/scripts/Throttle";

const throttle = new Throttle(1000);
export default {
  name: "ChatList",
  components: { HaButton, HaInputForm, HaSelect, CharacterSwitcher },
  props: {
    floatId: {
      type: Number,
      require: true
    }
  },
  computed: {
    userName() {
      return this.$store.getters["auth/user"].name;
    },
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
    },
    onKeydown() {
      throttle
        .do()
        .then(() => {
          FSUser.Ping(this.user.id);
        })
        .catch(() => {});
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
