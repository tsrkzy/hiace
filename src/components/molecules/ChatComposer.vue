<template>
  <div>
    <character-switcher ref="cs"></character-switcher>
    <ha-select label="ch:" :items="channelItems" v-model="channelIdChatTo">
      <option selected :value="SYSTEM_CHANNEL_ID">全体</option>
    </ha-select>
    <ha-input-form v-model="chatText"></ha-input-form>
    <ha-button @click="sendChat">send</ha-button>
  </div>
</template>

<script>
import { SYSTEM_CHANNEL_ID } from "@/collections/Channel";
import { FSChat, TEXT } from "@/collections/Chat";
import HaButton from "@/components/atoms/HaButton";
import HaInputForm from "@/components/atoms/HaInputForm";
import HaSelect from "@/components/atoms/HaSelect";
import CharacterSwitcher from "@/components/molecules/CharacterSwitcher";

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
        type: TEXT,
        room: roomId,
        channel: channelId,
        owner: userId,
        character: characterId,
        alias: aliasId,
        value: {
          text: chatText
        }
      };
      await FSChat.Create(c);
    }
  }
};
</script>

<style scoped></style>
