<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { Chat, ChatType } from "@/model/Chat";
  import { useChannels } from "@/model/store/channels";
  import { useCharacters } from "@/model/store/characters";
  import { useUsers } from "@/model/store/users";

  const { channels } = useChannels()
  const { characters } = useCharacters()
  const { users } = useUsers()

  export let chat = {} as Chat;
  const {
    type,
    channel,
    character,
    owner,
    value: {
      result = "",
      text = ""
    }
  } = chat;

  const lines = [...text.split("\n")];
  if (type === ChatType.DICE || type === ChatType.DICE_SECRET) {
    lines.push(result);
  }

  $: ch = $channels.find(ch => ch.id === channel);
  $: c = $characters.find(c => c.id === character);
  $: u = $users.find(u => u.id === owner);


</script>

<span class="chat-line channel">{`(${ch?.name || "全体"})`}</span>
<span class="chat-line name">{`${c?.name || u?.name || "!error"}: `}</span>
{#if lines.length === 1}
  <span class={`chat-line`}>{lines[0]}</span>
{:else }
  {#each lines as line, i }
    {#if !(i === 0 && (type === ChatType.DICE || type === ChatType.DICE_SECRET))}
      <br/>
    {/if}
    <span class={`chat-line ${i!==0? "multi":""}`}>{line}</span>
  {/each}
{/if}


<style lang="scss">
  .chat-line.multi {
    margin-left: 0.5rem;
    padding-left: 0.5rem;
    border-left: 2px solid #ccc;
  }
</style>