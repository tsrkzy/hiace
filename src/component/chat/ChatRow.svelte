<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { Chat } from "@/model/Chat.js";
  import { onMount } from "svelte";
  import { ReadManager } from "@/model/ReadManager";

  export let chat: Chat;
  export let isLatest = false;
  export let floatId: number;
  const isCreatedAsRead = ReadManager.Get(chat.id);


  const classStr = `chat-row ${isCreatedAsRead ? "" : "unread"} ${isLatest ? "latest" : ""}`

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
  <span>{chat.channel},{chat.owner},{chat.value.text}</span>
</li>

<style lang="scss">
  .chat-row {
    margin: 0;
    word-break: break-word;
  }

  .unread {
    background-color: rgb(255, 219, 59);
  }
</style>