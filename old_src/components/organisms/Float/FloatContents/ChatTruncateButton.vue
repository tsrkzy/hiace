<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    <span>
      <ha-checkbox
        label="チャットログを完全に削除する"
        v-model="deleteMode"
      ></ha-checkbox>
    </span>
    <span>
      <ha-button v-if="deleteMode" @click="onTruncateChat" :disabled="disabled"
        >削除
      </ha-button>
    </span>
  </div>
</template>
<script>
import { FSChat } from "@/collections/Chat";
import HaButton from "@/components/atoms/HaButton";
import HaCheckbox from "@/components/atoms/HaCheckbox";

export default {
  name: "chat-truncate-button",
  components: { HaCheckbox, HaButton },
  data() {
    return {
      disabled: false,
      deleteMode: false,
    };
  },
  methods: {
    async onTruncateChat() {
      const roomId = this.$store.getters["room/info"].id;
      this.disabled = true;
      await FSChat.Truncate(roomId);
      this.disabled = false;
    },
  },
};
</script>
