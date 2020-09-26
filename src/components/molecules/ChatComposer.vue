<template>
  <div>
    <ha-select label="ch:" :items="channelItems" v-model="channelIdChatTo"></ha-select>
    <h5>{{ channelIdChatTo }}</h5>
    <ha-input-form v-model="chatText"></ha-input-form>
    <ha-button @click="sendChat">send</ha-button>
  </div>
</template>

<script>
import { SYSTEM_CHANNEL_ID } from "@/collections/Channel";
import { FSChat } from "@/collections/Chat";
import HaButton from "@/components/atoms/HaButton";
import HaInputForm from "@/components/atoms/HaInputForm";
import HaSelect from "@/components/atoms/HaSelect";

export default {
  name: "ChatComposer",
  components: { HaButton, HaInputForm, HaSelect },
  computed: {
    channelItems() {
      return this.$store.getters["channel/info"].map(c => ({ text: c.name, value: c.id }));
    },
    room() {
      return this.$store.getters["room/info"];
    },
    user() {
      return this.$store.getters["auth/user"];
    },
  },
  data() {
    return {
      channelIdChatTo: SYSTEM_CHANNEL_ID,
      chatText: "",
    };
  },
  methods: {
    async sendChat() {
      console.log("DebugIndicator.sendChat"); // @DELETEME
      const { chatText: _chatText = "", channelIdChatTo: channelId } = this;
      if (!channelId) {
        throw new Error("no channel found");
      }

      const chatText = _chatText.trim();
      const roomId = this.room.id;
      const userId = this.user.id;
      const c = {
        type: "text",
        room: roomId,
        channel: channelId,
        owner: userId,
        character: null,
        value: {
          text: chatText
        },
      };
      await FSChat.Create(c);
    },
  }
};
</script>

<style scoped>

</style>