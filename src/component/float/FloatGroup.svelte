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

  const { floats } = useFloats();
</script>


<div class="float-group__container">
  {#each $floats as float}
    <FloatWindow {float}>
      <div class="content-container">
        {#if float.contentId === ContentId.CHAT_LIST}<h1>CHAT_LIST</h1>
        {:else if float.contentId === ContentId.CHARACTER_LIST}<h1>CHARACTER_LIST</h1>
        {:else if float.contentId === ContentId.CHARACTER_EDIT}<h1>CHARACTER_EDIT</h1>
        {:else if float.contentId === ContentId.BOARD_LIST}<h1>BOARD_LIST</h1>
        {:else if float.contentId === ContentId.MAP_EDIT}<h1>MAP_EDIT</h1>
        {:else if float.contentId === ContentId.TABLE_VIEW}<h1>TABLE_VIEW</h1>
        {:else if float.contentId === ContentId.CHAT_PALETTE}<h1>CHAT_PALETTE</h1>
        {:else if float.contentId === ContentId.IMAGE_MANAGER}<h1>IMAGE_MANAGER</h1>
        {:else if float.contentId === ContentId.SOUND_MANAGER}<h1>SOUND_MANAGER</h1>
        {:else if float.contentId === ContentId.ROOM_MANAGER}<RoomManager {float} />
        {:else if float.contentId === ContentId.CHANNEL_LIST}<h1>CHANNEL_LIST</h1>
        {:else if float.contentId === ContentId.NOTE_MANAGER}<h1>NOTE_MANAGER</h1>
        {:else if float.contentId === ContentId.ISSUE_WRITER}<h1>ISSUE_WRITER</h1>
        {:else }<h1>content not found</h1>
        {/if}
      </div>
    </FloatWindow>
  {/each}
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
