<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { onMount, onDestroy, tick } from "svelte";
  import { useChats } from "@/model/store/chats";
  import ChatRow from "@/component/chat/ChatRow.svelte";
  import { scrollChatToBottom } from "@/model/service/ChatService";
  import { ReadManager } from "@/model/ReadManager";
  import { get } from "svelte/store";

  export let floatId: number;

  const { chats } = useChats();

  // Chat一覧のfloatを開いた時点で最下部までスクロールするため、
  // その時点でのChatはすべて既読扱いにする
  const rm = ReadManager.New(get(chats).map(c => c.id));
  console.log(rm);

  const SCROLL_OFFSET = 5;
  const PAGE_SIZE = 200;

  $: derivedChat = $chats.slice($chats.length - PAGE_SIZE, $chats.length);

  // /* スクロール位置が最下部からSCROLL_MARGIN px以内 */
  let onBottom = false;

  const subscribe = chats.subscribe(() => {
    if (onBottom) {
      tick().then(() => scrollChatToBottom(floatId))
    } else {
      console.log("not on bottom");
    }
  })

  const onScrollChat = (e: Event) => {
    console.log("ChatLogViewer.onScrollChat");
    const target = e.target as HTMLDivElement;

    if (target.scrollTop + target.clientHeight >= target.scrollHeight - SCROLL_OFFSET) {
      console.log("scrolled to bottom");
      onBottom = true;
    } else {
      onBottom = false;
    }
  };

  onMount(() => {
    console.log("onMount");
    tick().then(() => scrollChatToBottom(floatId))
  })

  onDestroy(() => {
    subscribe();
  })
</script>


<div class="scroll-parent" on:scroll={onScrollChat}>
  <ol class="chat-log">
    {#each derivedChat as chat,i (chat.id)}
      <ChatRow {chat} floatId={floatId} isLatest={i===derivedChat.length-1}/>
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

  ol.chat-log{
    padding: 0;
    margin: 0;
    list-style: none;
  }

</style>