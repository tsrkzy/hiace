<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useChannels } from "@/model/store/channels";
  import { useAuth } from "@/model/store/auth";
  import { createChannel, deleteChannel } from "@/model/service/ChannelService";
  import { useRoom } from "@/model/store/room";
  import { useChats } from "@/model/store/chats";
  import { createChat, insertDummyChat } from "@/model/service/ChatService";
  import { useUsers } from "@/model/store/users";
  import { ChatTypes } from "@/model/Chat";


  export let open = false;

  const { channels } = useChannels()
  const { chats } = useChats()
  const { roomId } = useRoom()
  const { myUserId } = useUsers()
  const { isLoggedIn } = useAuth()

  const handleCreateChannel = async () => {
    console.log("ChannelList.handleCreateChannel");
    await createChannel({
      name: `channel_${Date.now()}`
      , roomId: $roomId
    })
  }

  const handleCreateSystemChat = async () => {
    console.log("ChannelList.handleCreateSystemChat");
    await createChat({
      roomId: $roomId,
      channelId: "SYSTEM",
      aliasId: null,
      characterId: null,
      color: "#000000",
      userId: $myUserId,
      type: ChatTypes.SYSTEM,
      value: {
        text: `${Date.now()}`
      }
    })
  }

  const handleCreateChat = async (channelId: string) => {
    console.log("ChannelList.handleCreateChat");
    await createChat({
      roomId: $roomId,
      channelId: channelId,
      aliasId: null,
      characterId: null,
      color: "#000000",
      userId: $myUserId,
      type: ChatTypes.SYSTEM,
      value: {
        text: `${Date.now()}`
      }
    })
  }

  const handleDeleteChannel = async (channelId: string) => {
    console.log("ChannelList.handleDeleteChannel");
    await deleteChannel({
      channelId
    })
  }

  const onClickBulkInsert = async (amountOfChat: number) => {
    const userId = $myUserId
    await insertDummyChat(amountOfChat, { userId, roomId: $roomId })
  }
</script>

<main>
  <details {open}>
    <summary>Channels</summary>
    {#if $isLoggedIn}
      <ul>
        <li>SYSTEM</li>
        <ul>
          {#each $chats as chat}
            <li>{chat.id}, {chat.value.text}</li>
          {/each}
          <button on:click={()=>handleCreateSystemChat()}>add chat</button>
        </ul>
      </ul>
    {/if}
    {#each $channels as c}
      <ul>
        <li>
          <button on:click={()=>handleDeleteChannel(c.id)}>delete</button>
          channel: {c.id},{c.name}</li>
        <ul>
          {#each $chats as chat}
            {#if chat.channel === c.id}
              <li>{chat.id}, {chat.value.text}</li>
            {/if}
          {/each}
          <button on:click={()=>handleCreateChat(c.id)}>add chat</button>
        </ul>
      </ul>
    {/each}
  </details>
  {#if $isLoggedIn}
    <button on:click={()=>handleCreateChannel()}>add channel</button>
    <button on:click={()=>onClickBulkInsert(500)}>チャット500件作成</button>
    <button on:click={()=>onClickBulkInsert(1)}>チャット1件作成</button>

  {/if}
</main>