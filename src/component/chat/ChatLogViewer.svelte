<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { onMount, } from "svelte";
  import { useChats } from "../../model/store/chats";
  import ChatRow from "./ChatRow.svelte";
  import { scrollChatToBottom } from "../../model/service/ChatService";

  const { chats } = useChats();

  // const SCROLL_OFFSET = 5;
  const PAGE_SIZE = 200;

  $: derivedChat = $chats.slice($chats.length - PAGE_SIZE, $chats.length);

  // /* スクロール位置が最下部からSCROLL_MARGIN px以内 */
  // let onBottom = false;
  //
  const onScrollChat = (e: Event) => {
    console.log("ChatLogViewer.onScrollChat", e);
    //   const target = e.target as HTMLDivElement;
    //
    //   if (target.scrollTop + target.clientHeight >= target.scrollHeight - SCROLL_OFFSET) {
    //     console.log("scrolled to bottom");
    //     onBottom = true;
    //   } else {
    //     onBottom = false;
    //   }
  };

  onMount(() => {
    console.log("onMount");
    scrollChatToBottom()
  })
</script>


<div class="scroll-parent" on:scroll={onScrollChat}>
  <ol>
    {#each derivedChat as chat,i (chat.id)}
      <ChatRow {chat} latest={i===derivedChat.length-1}/>
    {/each}
  </ol>
</div>

<style lang="scss">
  .scroll-parent {
    height: calc(100% - 107px);
    width: 100%;
    background-color: floralwhite;
    overflow-y: scroll;
    overflow-x: hidden;
  }

</style>