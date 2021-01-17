<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <li
    :style="{
      margin: 0,
      wordBreak: 'break-word',
      fontWeight: system ? 'normal' : 'bold',
      fontStyle: system ? 'italic' : 'normal',
      color: system ? 'lightgray' : color
    }"
    :class="{ dim }"
  >
    <!-- channel -->
    <span
      :style="{ fontWeight: 'normal', color: dim ? 'lightgray' : 'gray' }"
      >{{ channel }}</span
    >
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
import { FSChannel } from "@/collections/Channel";
import { FSCharacter } from "@/collections/Character";
import { SYSTEM, SYSTEM_COLOR } from "@/collections/Chat";
import { FSUser } from "@/collections/User";

export default {
  name: "ChatRow",
  props: {
    chatId: { type: String, require: true },
    dim: { type: Boolean, default: false }
  },
  computed: {
    chat() {
      return this.$store.getters["chat/info"].find(c => c.id === this.chatId);
    },
    system() {
      return this.chat.type === SYSTEM;
    },
    channel() {
      const chat = this.chat;
      if (this.system) {
        return "";
      }
      const c = this.getChannelName(chat) || "none";
      return `(${c}) `;
    },
    speaker() {
      const chat = this.chat;
      if (this.system) {
        return "$ hiace > ";
      }
      const s = this.getCharacterName(chat) || this.getUserName(chat);
      return `${s}: `;
    },
    textList() {
      const chat = this.chat;
      const isDice = chat.type === "DICE";
      const result = chat.value.result;
      const textList = chat.value.text.split(/\n/);
      return isDice ? [...textList, result] : textList;
    },
    color() {
      return this.dim ? "lightgray" : this.chat?.color || SYSTEM_COLOR;
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
    getUserName(chatItem) {
      const { owner } = chatItem;
      return FSUser.Who(owner);
    }
  }
};
</script>

<style scoped></style>
