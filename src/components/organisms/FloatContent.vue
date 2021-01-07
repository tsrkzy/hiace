<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div class="float-content">
    <character-list
      v-if="contentId === CHARACTER_LIST"
      :float-id="floatId"
    ></character-list>
    <character-edit
      v-else-if="contentId === CHARACTER_EDIT"
      :float-id="floatId"
    ></character-edit>
    <board-list
      v-else-if="contentId === BOARD_LIST"
      :float-id="floatId"
    ></board-list>
    <map-edit v-else-if="contentId === MAP_EDIT" :float-id="floatId"></map-edit>
    <chat-list
      v-else-if="contentId === CHAT_LIST"
      :float-id="floatId"
    ></chat-list>
    <table-view v-else-if="contentId === TABLE_VIEW" :float-id="floatId">
    </table-view>
    <image-manager
      v-else-if="contentId === IMAGE_MANAGER"
      :float-id="floatId"
    ></image-manager>
    <sound-manager v-else-if="contentId === SOUND_MANAGER" :float-id="floatId">
    </sound-manager>
    <room-manager v-else-if="contentId === ROOM_MANAGER" :float-id="floatId">
    </room-manager>
    <div :float-id="floatId" v-else>content not found: {{ contentId }}</div>
  </div>
</template>

<script>
import RoomManager from "@/components/organisms/FloatContents/RoomManager";
import MapEdit from "@/components/organisms/MapEdit";
import BoardList from "@/components/organisms/FloatContents/BoardList";
import CharacterEdit from "@/components/organisms/FloatContents/CharacterEdit";
import CharacterList from "@/components/organisms/FloatContents/CharacterList";
import ChatList from "@/components/organisms/FloatContents/ChatList";
import ImageManager from "@/components/organisms/FloatContents/ImageManager";
import SoundManager from "@/components/organisms/FloatContents/SoundManager";
import TableView from "@/components/organisms/FloatContents/TableView";
import {
  CHARACTER_LIST,
  CHARACTER_EDIT,
  BOARD_LIST,
  MAP_EDIT,
  CHAT_LIST,
  TABLE_VIEW,
  IMAGE_MANAGER,
  SOUND_MANAGER,
  ROOM_MANAGER
} from "@/interfaces/IFFloat";

export default {
  name: "FloatContent",
  components: {
    RoomManager,
    MapEdit,
    SoundManager,
    ImageManager,
    TableView,
    CharacterEdit,
    ChatList,
    BoardList,
    CharacterList
  },
  data() {
    return {
      CHARACTER_LIST,
      CHARACTER_EDIT,
      BOARD_LIST,
      MAP_EDIT,
      CHAT_LIST,
      TABLE_VIEW,
      IMAGE_MANAGER,
      SOUND_MANAGER,
      ROOM_MANAGER
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
