<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div class="float-content">
    <character-list
      :float-id="floatId"
      v-if="contentId === CHARACTER_LIST"
    ></character-list>
    <character-edit
      :float-id="floatId"
      v-else-if="contentId === CHARACTER_EDIT"
    ></character-edit>
    <board-list
      :float-id="floatId"
      v-else-if="contentId === BOARD_LIST"
    ></board-list>
    <chat-list
      :float-id="floatId"
      v-else-if="contentId === CHAT_LIST"
    ></chat-list>
    <table-view :float-id="floatId" v-else-if="contentId === TABLE_VIEW">
    </table-view>
    <div :float-id="floatId" v-else>content not found: {{ contentId }}</div>
  </div>
</template>

<script>
import BoardList from "@/components/organisms/FloatContents/BoardList";
import CharacterEdit from "@/components/organisms/FloatContents/CharacterEdit";
import CharacterList from "@/components/organisms/FloatContents/CharacterList";
import ChatList from "@/components/organisms/FloatContents/ChatList";
import TableView from "@/components/organisms/FloatContents/TableView";
import {
  CHARACTER_LIST,
  CHARACTER_EDIT,
  BOARD_LIST,
  CHAT_LIST,
  TABLE_VIEW
} from "@/interfaces/IFFloat";

export default {
  name: "FloatContent",
  components: { TableView, CharacterEdit, ChatList, BoardList, CharacterList },
  data() {
    return {
      CHARACTER_LIST,
      CHARACTER_EDIT,
      BOARD_LIST,
      CHAT_LIST,
      TABLE_VIEW
    };
  },
  props: {
    floatId: {
      type: Number,
      require: true
    },
    contentId: {
      type: String,
      require: true
    }
  }
};
</script>

<style scoped lang="scss">
.float-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
