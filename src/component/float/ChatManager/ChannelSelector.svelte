<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { CHANNEL_ID_NULL } from "@/constant.js";
  import { Channel } from "@/model/Channel";

  export let channels: Channel[];
  export let channelId: string = CHANNEL_ID_NULL;

  const dispatcher = createEventDispatcher<{ changeChannelId: string }>();

  const onChangeAlias = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const value = target.value;
    dispatcher("changeChannelId", value)
  }
</script>

<select on:change={(e)=>onChangeAlias(e)}>
  <option value={CHANNEL_ID_NULL} selected={channelId === CHANNEL_ID_NULL}>チャンネルなし</option>
  {#each channels as channel (channel.id)}
    <option value={channel.id} selected={channel.id === channelId}>{channel.name}</option>
  {/each}
</select>