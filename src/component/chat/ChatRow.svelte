<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { Chat } from "../../model/Chat.js";

  export let chat: Chat;
  export let latest = false;
  export let floatId: number;
</script>

<li class={`chat-row ${latest?`latest_floatId-${floatId}`:""}`} data-chat-id={chat.id}>
  <span>{chat.channel},{chat.owner},{chat.value.text}</span>
</li>

<style lang="scss">
  .chat-row {
    margin: 0;
    word-break: break-word;
  }
</style>