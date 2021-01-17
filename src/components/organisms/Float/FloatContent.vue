<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
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
    <channel-list v-else-if="contentId === CHANNEL_LIST" :float-id="floatId">
    </channel-list>
    <div :float-id="floatId" v-else>content not found: {{ contentId }}</div>
  </div>
</template>

<script>
import ChannelList from "@/components/organisms/Float/FloatContents/ChannelList";
import RoomManager from "@/components/organisms/Float/FloatContents/RoomManager";
import MapEdit from "@/components/organisms/Float/FloatContents/MapEditor/MapEdit";
import BoardList from "@/components/organisms/Float/FloatContents/BoardList";
import CharacterEdit from "@/components/organisms/Float/FloatContents/CharacterEdit";
import CharacterList from "@/components/organisms/Float/FloatContents/CharacterList";
import ChatList from "@/components/organisms/Float/FloatContents/ChatList/ChatList";
import ImageManager from "@/components/organisms/Float/FloatContents/ImageManager";
import SoundManager from "@/components/organisms/Float/FloatContents/SoundManager";
import TableView from "@/components/organisms/Float/FloatContents/TableView";
import {
  CHARACTER_LIST,
  CHARACTER_EDIT,
  BOARD_LIST,
  MAP_EDIT,
  CHAT_LIST,
  TABLE_VIEW,
  IMAGE_MANAGER,
  SOUND_MANAGER,
  ROOM_MANAGER,
  CHANNEL_LIST
} from "@/interfaces/IFFloat";

export default {
  name: "FloatContent",
  components: {
    ChannelList,
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
      ROOM_MANAGER,
      CHANNEL_LIST
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
