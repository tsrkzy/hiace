<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { useFloats } from "@/model/store/floats";
  import FloatWindow from "./FloatWindow.svelte";
  import { ContentId } from "@/model/Float.js";
  import RoomManager from "./RoomManager.svelte";
  import BoardManager from "./BoardManager/BoardManager.svelte";
  import { useMapChips } from "@/model/store/mapChips";
  import { usePawns } from "@/model/store/pawns";
  import { useBoards } from "@/model/store/boards";
  import CharacterManager from "./CharacterManager.svelte";
  import MapEdit from "./MapEdit.svelte";
  import CharacterEdit from "./CharacterEdit/CharacterEdit.svelte";
  import ImageManager from "./ImageManager.svelte";
  import ChannelManager from "./ChannelManager/ChannelManager.svelte";
  import ChatManager from "./ChatManager/ChatManager.svelte";
  import SoundManager from "@/component/float/SoundManager/SoundManager.svelte";
  import TableManager from "@/component/float/TableManager/TableManager.svelte";

  const { floats } = useFloats();
  const { draggedBoardId } = useBoards()
  const { draggedMapChipId } = useMapChips()
  const { draggedPawnId } = usePawns()

  $: isDragging = (!$draggedBoardId) && (!$draggedMapChipId) && !($draggedPawnId)
</script>


<div class="float-group__container">
  {#if isDragging}
    {#each $floats as float (float.id)}
      <FloatWindow {float}>
        <div class="content-container">
          {#if float.contentId === ContentId.CHAT_LIST}
            <ChatManager {float}/>
          {:else if float.contentId === ContentId.CHARACTER_MANAGER}
            <CharacterManager {float}/>
          {:else if float.contentId === ContentId.CHARACTER_EDIT}
            <CharacterEdit {float}/>
          {:else if float.contentId === ContentId.BOARD_MANAGER}
            <BoardManager {float}/>
          {:else if float.contentId === ContentId.MAP_EDIT}
            <MapEdit {float}/>
          {:else if float.contentId === ContentId.TABLE_MANAGER}
            <TableManager />
          {:else if float.contentId === ContentId.IMAGE_MANAGER}
            <ImageManager {float}/>
          {:else if float.contentId === ContentId.SOUND_MANAGER}
            <SoundManager />
          {:else if float.contentId === ContentId.ROOM_MANAGER}
            <RoomManager {float}/>
          {:else if float.contentId === ContentId.CHANNEL_LIST}
            <ChannelManager {float}/>
          {:else if float.contentId === ContentId.NOTE_MANAGER}NOTE_MANAGER
          {:else if float.contentId === ContentId.ISSUE_WRITER}ISSUE_WRITER
          {:else }<h1>content not found</h1>
          {/if}
        </div>
      </FloatWindow>
    {/each}
  {/if}
</div>

<style lang="scss">
  .float-group__container {
    z-index: 0;
    position: absolute;
    top: 0;
    left: 0;
  }

  .content-container {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
  }
</style>
