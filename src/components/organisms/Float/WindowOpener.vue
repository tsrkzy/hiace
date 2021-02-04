<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <label>
    <select v-model="contentId" @change="onWindowOpener">
      <option v-for="c in contents" :key="c.id" :value="c.id">{{
        c.text
      }}</option>
    </select>
  </label>
</template>

<script>
import {
  BOARD_LIST,
  CHARACTER_LIST,
  CHAT_LIST,
  IMAGE_MANAGER,
  SOUND_MANAGER,
  TABLE_VIEW,
  ROOM_MANAGER,
  CHANNEL_LIST,
  NOTE_MANAGER,
  title,
  UNSET,
  ISSUE_WRITER
} from "@/interfaces/IFFloat";

export default {
  name: "WindowOpener",
  methods: {
    async onWindowOpener(e) {
      const { value: contentId } = e.currentTarget;
      console.log("Room.onWindowOpener", contentId); // @DELETEME
      await this.$store.dispatch("float/create", { contentId, show: true });
      this.contentId = UNSET;
    }
  },
  computed: {
    contents() {
      const contentList = [
        CHARACTER_LIST,
        BOARD_LIST,
        CHAT_LIST,
        TABLE_VIEW,
        IMAGE_MANAGER,
        SOUND_MANAGER,
        ROOM_MANAGER,
        CHANNEL_LIST,
        NOTE_MANAGER,
        ISSUE_WRITER
      ];

      const contents = contentList.map(id => ({ id, text: title(id) }));
      contents.unshift({ id: UNSET, text: "ウィンドウを開く" });
      return contents;
    }
  },
  data() {
    return {
      contentId: UNSET
    };
  }
};
</script>

<style scoped></style>
