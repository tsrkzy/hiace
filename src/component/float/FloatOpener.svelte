<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { ContentId, ContentTitle } from "@/model/Float";
  import { openFloat, } from "@/model/service/FloatService";


  const contents = [
    { id: ContentId.ROOM_MANAGER, name: ContentTitle(ContentId.ROOM_MANAGER) },
    { id: ContentId.BOARD_MANAGER, name: ContentTitle(ContentId.BOARD_MANAGER) },
    { id: ContentId.CHARACTER_MANAGER, name: ContentTitle(ContentId.CHARACTER_MANAGER) },
    { id: ContentId.IMAGE_MANAGER, name: ContentTitle(ContentId.IMAGE_MANAGER) },
    { id: ContentId.CHANNEL_LIST, name: ContentTitle(ContentId.CHANNEL_LIST) },
    { id: ContentId.CHAT_LIST, name: ContentTitle(ContentId.CHAT_LIST) },
    { id: ContentId.SOUND_MANAGER, name: ContentTitle(ContentId.SOUND_MANAGER) },
  ]

  const onContentChangeHandler = (e: Event) => {
    console.log("FloatOpener.onContentChangeHandler");
    const { value: contentId } = e.currentTarget as HTMLSelectElement;
    openFloat(<ContentId>contentId);

    (e.currentTarget as HTMLSelectElement).value = ContentId.UNSET;
  }
</script>

<label id="float-opener">
  <select on:change={(e)=>onContentChangeHandler(e)}>
    <option value={ContentId.UNSET} selected disabled>{ContentTitle(ContentId.UNSET)}</option>
    {#each contents as c(c.id)}
      <option value={c.id}>{c.name}</option>
    {/each}
  </select>
</label>
