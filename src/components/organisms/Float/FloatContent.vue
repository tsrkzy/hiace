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
    <chat-pallete
      v-else-if="contentId === CHAT_PALETTE"
      :float-id="floatId"
    ></chat-pallete>
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
    <note-manager v-else-if="contentId === NOTE_MANAGER" :float-id="floatId">
    </note-manager>
    <issue-writer
      v-else-if="contentId === ISSUE_WRITER"
      :float-id="floatId"
    ></issue-writer>
    <div :float-id="floatId" v-else>content not found: {{ contentId }}</div>
  </div>
</template>

<script>
import ChannelList from "@/components/organisms/Float/FloatContents/ChannelList";
import ChatPallete from "@/components/organisms/Float/FloatContents/ChatPalette";
import IssueWriter from "@/components/organisms/Float/FloatContents/IssueWriter";
import NoteManager from "@/components/organisms/Float/FloatContents/NoteManager";
import RoomManager from "@/components/organisms/Float/FloatContents/RoomManager";
import MapEdit from "@/components/organisms/Float/FloatContents/MapEditor/MapEdit";
import BoardList from "@/components/organisms/Float/FloatContents/BoardList";
import CharacterEdit from "@/components/organisms/Float/FloatContents/CharacterList/CharacterEdit";
import CharacterList from "@/components/organisms/Float/FloatContents/CharacterList/CharacterList";
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
  CHAT_PALETTE,
  IMAGE_MANAGER,
  SOUND_MANAGER,
  ROOM_MANAGER,
  CHANNEL_LIST,
  NOTE_MANAGER,
  ISSUE_WRITER,
} from "@/interfaces/IFFloat";

export default {
  name: "FloatContent",
  components: {
    ChatPallete,
    IssueWriter,
    NoteManager,
    ChannelList,
    RoomManager,
    MapEdit,
    SoundManager,
    ImageManager,
    TableView,
    CharacterEdit,
    ChatList,
    BoardList,
    CharacterList,
  },
  data() {
    return {
      CHARACTER_LIST,
      CHARACTER_EDIT,
      BOARD_LIST,
      MAP_EDIT,
      CHAT_LIST,
      TABLE_VIEW,
      CHAT_PALETTE,
      IMAGE_MANAGER,
      SOUND_MANAGER,
      ROOM_MANAGER,
      CHANNEL_LIST,
      NOTE_MANAGER,
      ISSUE_WRITER,
    };
  },
  props: {
    floatId: {
      type: Number,
      require: true,
    },
    contentId: {
      type: String,
      require: true,
    },
  },
};
</script>

<style scoped lang="scss">
.float-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
