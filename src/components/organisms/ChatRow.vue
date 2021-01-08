<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <li :style="{ margin: 0, wordBreak: 'break-word', color: color }">
    <!-- channel -->
    <span style="color: #000000;">{{ channel }}</span>
    <!-- speaker -->
    <span>{{ speaker }}</span>
    <!-- one line -->
    <span v-if="textList.length === 1">{{ textList[0] }}</span>
    <!-- multi lines -->
    <span v-else v-for="(t, i) of textList" :key="i">
      <br />
      <span
        :style="{
          marginLeft: '0.5rem',
          paddingLeft: '0.5rem',
          borderLeft: '1px solid lightgray'
        }"
        >{{ t }}</span
      >
    </span>
  </li>
</template>

<script>
import { FSAlias } from "@/collections/Alias";
import { FSChannel } from "@/collections/Channel";
import { FSCharacter } from "@/collections/Character";
import { SYSTEM_COLOR } from "@/collections/Chat";
import { FSUser } from "@/collections/User";

export default {
  name: "ChatRow",
  props: {
    chatId: { type: String, require: true }
  },
  computed: {
    chat() {
      return this.$store.getters["chat/info"].find(c => c.id === this.chatId);
    },
    channel() {
      const chat = this.chat;
      const c = this.getChannelName(chat) || "none";
      return `(${c})`;
    },
    speaker() {
      const chat = this.chat;
      const s = this.getCharacterName(chat) || this.getUserName(chat);
      const a = chat.alias ? `(${this.getAliasName(chat)})` : "";
      return `${s} ${a}:`;
    },
    textList() {
      const chat = this.chat;
      const isDice = chat.type === "DICE";
      const result = chat.value.result;
      const textList = chat.value.text.split(/\n/);
      return isDice ? [...textList, result] : textList;
    },
    color() {
      return this.chat?.color || SYSTEM_COLOR;
    }
  },
  methods: {
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
  }
};
</script>

<style scoped></style>
