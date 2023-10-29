<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useChannels } from "../model/store/channels";
  import { useAuth } from "../model/store/auth";
  import { createChannel, deleteChannel } from "../model/service/ChannelService";
  import { useRoom } from "../model/store/room";


  export let open = false;

  const { channels } = useChannels()
  const { roomId } = useRoom()
  const { isLoggedIn } = useAuth()

  const handleCreateChannel = async () => {
    console.log("ChannelList.handleCreateChannel");
    await createChannel({
      name: `channel_${Date.now()}`
      , roomId: $roomId
    })
  }

  const handleDeleteChannel = async (channelId: string) => {
    console.log("ChannelList.handleDeleteChannel");
    await deleteChannel({
      channelId
    })
  }
</script>

<main>
  <details {open}>
    <summary>Channels</summary>
    {#each $channels as c}
      <ul>
        <li>
          <button on:click={()=>handleDeleteChannel(c.id)}>delete</button> {c.id},{c.name}</li>
      </ul>
    {/each}
  </details>
  {#if $isLoggedIn}
    <button on:click={()=>handleCreateChannel()}>add channel</button>
  {/if}
</main>