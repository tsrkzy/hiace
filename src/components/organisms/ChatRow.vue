<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <li style="margin: 0;word-break: break-word;">
    <span>{{ format }}</span>
    <span v-if="textList.length === 1">{{ textList[0] }}</span>
    <span v-else v-for="(t, i) of textList" :key="i">
      <br />
      <span
        style="margin-left: 0.5rem;padding-left: 0.5rem;border-left: 1px solid lightgray;"
        >{{ t }}</span
      >
    </span>
  </li>
</template>

<script>
import { FSAlias } from "@/collections/Alias";
import { FSChannel } from "@/collections/Channel";
import { FSCharacter } from "@/collections/Character";
import { FSUser } from "@/collections/User";

export default {
  name: "ChatRow",
  props: {
    chatId: { type: String, require: true },
    floatId: { type: Number, require: true }
  },
  computed: {
    chat() {
      return this.$store.getters["chat/info"].find(c => c.id === this.chatId);
    },
    format() {
      const chat = this.chat;
      const c = this.getChannelName(chat) || "none";
      const s = this.getCharacterName(chat) || this.getUserName(chat);
      const a = chat.alias ? `(${this.getAliasName(chat)})` : "";
      return `(${c}) ${s} ${a}:`;
    },
    textList() {
      const chat = this.chat;
      const isDice = chat.type === "DICE";
      const result = chat.value.result;
      const textList = chat.value.text.split(/\n/);
      return isDice ? [...textList, result] : textList;
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
