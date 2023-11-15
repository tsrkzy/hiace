<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { Chat } from "../../model/Chat.js";
  import { onMount } from "svelte";

  export let chat: Chat;
  export let latest = false;
  let unread = true;

  $: classStr = (() => {
    return `chat-row ${unread ? "unread" : ""} ${latest ? "latest" : ""}`
  })()

  onMount(() => {
    const observeTarget = `li[data-chat-id="${chat.id}"]`;

    /*
     * 要素の50%が読み込まれてビューポートに入ったら
     * 1秒後にunreadフラグをfalseにして監視を解除
     */
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(() => {
            unread = false;
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

<li class={classStr} data-chat-id={chat.id}>
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