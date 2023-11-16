<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">

  import Button from "../../button/Button.svelte";
  import { Float } from "../../../model/Float";
  import { createChannel, deleteChannel, updateChannel } from "../../../model/service/ChannelService";
  import { useRoom } from "../../../model/store/room";
  import { useChannels } from "../../../model/store/channels";
  import InputText from "../../input/InputText.svelte";

  export const float = {} as Float;

  const { room } = useRoom()
  const { channels } = useChannels()

  const onClickAddChannel = async () => {
    console.log("ChannelManager.onClickAddChannel");
    await createChannel({ roomId: $room.id, name: "新規チャンネル" });
  }

  const onDeleteChannel = async (channelId: string) => {
    console.log("ChannelManager.onDeleteChannel");
    await deleteChannel({ channelId });
  }

  const onBlurChannelName = async (e: Event, channelId: string) => {
    console.log("ChannelManager.onBlurChannelName");
    const currentTarget = e.currentTarget as HTMLInputElement;
    const name = currentTarget.value.trim();
    if (!name) {
      const channel = $channels.find(c => c.id === channelId);
      currentTarget.value = channel!.name
      return
    }
    await updateChannel({ channelId, criteria: { name } });
  }
</script>

<Button handle={()=>onClickAddChannel()}>新規作成</Button>
<ul>
  {#each $channels as c (c.id)}
    <li>
      <InputText
          value={c.name}
          onBlur={(e)=>onBlurChannelName(e, c.id)}
      ></InputText>
      <Button handle={()=>onDeleteChannel(c.id)}>削除</Button>
    </li>
  {/each}
</ul>
