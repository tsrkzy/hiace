<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { useChats } from "../../model/store/chats";
  import ChatRow from "./ChatRow.svelte";

  const { chats } = useChats();

  const PAGE_SIZE = 200;
  $: derivedChat = $chats.slice($chats.length - PAGE_SIZE, $chats.length);
</script>


<div class="scroll-parent">
  <ol>
    {#each derivedChat as chat,i (chat.id)}
      <ChatRow {chat} latest={i===derivedChat.length-1}/>
    {/each}
  </ol>
</div>

<style lang="scss">
  .scroll-parent {
    width: 100%;
    height: 100%;
    background-color: floralwhite;
    overflow-y: scroll;
    overflow-x: hidden;
  }

</style>