<template>
  <div>
    <character-switcher ref="cs"></character-switcher>
    <ha-select label="ch:" :items="channelItems" v-model="channelIdChatTo">
      <option selected :value="SYSTEM_CHANNEL_ID">全体</option>
    </ha-select>
    <ha-select label="dice:" :items="diceBotItems" v-model="diceSystem">
    </ha-select>
    <ha-input-form @keydown="onKeydown" v-model="chatText"></ha-input-form>
    <ha-button @click="sendChat">send</ha-button>
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
  name: "ChatComposer",
  components: { CharacterSwitcher, HaButton, HaInputForm, HaSelect },
  computed: {
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
  }
};
</script>

<style scoped></style>
