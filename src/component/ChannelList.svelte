<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useChannels } from "../model/store/channels";

  export let open = false;

  const { channels } = useChannels()


</script>

<main>
  <details {open}>
    <summary>Channels</summary>
    {#each $channels as c}
      <ul>
        <li>{c.id},{c.name}</li>
      </ul>
    {/each}
  </details>
</main>