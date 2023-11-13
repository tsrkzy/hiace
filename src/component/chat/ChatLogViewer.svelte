<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { onDestroy, tick } from "svelte";
  import { useChats } from "../../model/store/chats";
  import ChatRow from "./ChatRow.svelte";

  export let floatId: number;
  const { chats } = useChats();

  const scrollToBottom = () => {
    const elements = document.getElementsByClassName(`latest_floatId-${floatId}`);
    if (!elements.length) {
      return;
    }
    const element = elements[0];
    element.scrollIntoView({ behavior: "smooth" });
  }

  const unsubscribe = chats.subscribe(() => {
    console.log("ChatLogViewer.onChatReceived");
    tick().then(() => scrollToBottom())
  });

  onDestroy(() => {
    console.log("ChatLogViewer.onDestroy");
    unsubscribe();
  });

  const PAGE_SIZE = 200;
  $: derivedChat = $chats.slice($chats.length - PAGE_SIZE, $chats.length);
</script>


<div class="scroll-parent">
  <ol>
    {#each derivedChat as chat,i (chat.id)}
      <ChatRow {chat} {floatId} latest={i===derivedChat.length-1}/>
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