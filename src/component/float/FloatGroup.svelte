<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { useFloats } from "../../model/store/floats";
  import FloatWindow from "./FloatWindow.svelte";
  import { ContentId } from "../../model/Float.js";
  import RoomManager from "./RoomManager.svelte";
  import BoardManager from "./BoardManager.svelte";
  import { useMapChips } from "../../model/store/mapChips";
  import { usePawns } from "../../model/store/pawns";
  import { useBoards } from "../../model/store/boards";

  const { floats } = useFloats();
  const { draggedBoardId } = useBoards()
  const { draggedMapChipId } = useMapChips()
  const { draggedPawnId } = usePawns()

  $: isDragging = (!$draggedBoardId) && (!$draggedMapChipId) && !($draggedPawnId)
</script>


<div class="float-group__container">
  {isDragging}
  {#if isDragging}
    {#each $floats as float (float.id)}
      <FloatWindow {float}>
        <div class="content-container">
          {#if float.contentId === ContentId.CHAT_LIST}CHAT_LIST
          {:else if float.contentId === ContentId.CHARACTER_LIST}CHARACTER_LIST
          {:else if float.contentId === ContentId.CHARACTER_EDIT}CHARACTER_EDIT
          {:else if float.contentId === ContentId.BOARD_MANAGER}
            <BoardManager {float}/>
          {:else if float.contentId === ContentId.MAP_EDIT}MAP_EDIT
          {:else if float.contentId === ContentId.TABLE_VIEW}TABLE_VIEW
          {:else if float.contentId === ContentId.CHAT_PALETTE}CHAT_PALETTE
          {:else if float.contentId === ContentId.IMAGE_MANAGER}IMAGE_MANAGER
          {:else if float.contentId === ContentId.SOUND_MANAGER}SOUND_MANAGER
          {:else if float.contentId === ContentId.ROOM_MANAGER}
            <RoomManager {float}/>
          {:else if float.contentId === ContentId.CHANNEL_LIST}CHANNEL_LIST
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
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .content-container {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
  }
</style>
