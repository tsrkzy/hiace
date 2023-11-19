<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { Chat, ChatType } from "@/model/Chat.js";
  import { onMount } from "svelte";
  import { ReadManager } from "@/model/ReadManager";
  import ChatLines from "@/component/chat/ChatLines.svelte";

  export let chat: Chat;
  export let isLatest = false;
  export let floatId: number;
  const isCreatedAsRead = ReadManager.Get(chat.id);


  const classStr = [
    "chat-row"
    , chat.type === ChatType.SYSTEM ? "system" : ""
    , isCreatedAsRead ? "" : "unread"
    , isLatest ? "latest" : ""].join(" ")

  onMount(() => {
    if (isCreatedAsRead) {
      return
    }

    const observeTarget = `li[data-chat-id="${chat.id}"][data-float-id="${floatId}"]`;

    /*
     * 要素の50%が読み込まれてビューポートに入ったら
     * 1秒後にunreadフラグをfalseにして監視を解除
     */
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(() => {
            ReadManager.Set(chat.id);
            entry.target.classList.remove("unread");
          }, 1000);
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    const targetElement = document.querySelector(observeTarget);
    if (targetElement) {
      observer.observe(targetElement);
    }
  })

</script>

<li class={classStr} data-chat-id={chat.id} data-float-id={floatId}>
  <ChatLines chat={chat}></ChatLines>
</li>

<style lang="scss">
  li.chat-row {
    margin: 0;
    word-break: break-word;
    font-weight: bold;
    font-style: normal;
    color: #000000;

    &.system {
      font-weight: normal;
      font-style: italic;
      color: lightgray;
    }
  }

  .unread {
    background-color: rgb(255, 219, 59);
  }
</style>