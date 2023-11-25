<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useSounds } from "@/model/store/sounds";
  import Button from "@/component/button/Button.svelte";
  import { registerSound, updateSound } from "@/model/service/SoundService";
  import { useRoom } from "@/model/store/room";
  import { useUsers } from "@/model/store/users";
  import { updateRoom } from "@/model/service/RoomService";
  import Checkbox from "@/component/input/Checkbox.svelte";

  const { sounds } = useSounds()
  const { room } = useRoom()
  const { myUserId } = useUsers()

  // roomに設定されているsoundId
  $: music = $sounds.find(s => s.id === $room.music)

  let localSoundId = "";
  $: localMusic = $sounds.find(s => s.id === localSoundId)

  const onClickFileUploadHandler = async () => {
    console.log("SoundManager.onClickFileUploadHandler");

    const inputEl = document.createElement("input");
    inputEl.type = "file";
    inputEl.multiple = true;
    inputEl.accept = "audio/*";
    inputEl.addEventListener("change", async (e) => {
      const { files } = e.target as HTMLInputElement;
      if (!files) {
        return;
      }

      /* input要素から取得したBGMをアップロードし、firestoreに登録する */
      await Promise.all(Array.from(files).map(f => registerSound(f, $room.id, $myUserId)));
    });
    inputEl.click();
  }

  const onClickSetMusic = async (soundId: string) => {
    console.log("SoundManager.onClickSetMusic");
    await updateRoom({ roomId: $room.id, criteria: { music: soundId } });
  }
  const onClickUnsetMusic = async () => {
    console.log("SoundManager.onClickUnsetMusic");
    await updateRoom({ roomId: $room.id, criteria: { music: null } });
  }

  const onClickPlayLocal = async (soundId: string) => {
    console.log("SoundManager.onClickPlayLocal");
    localSoundId = soundId
  }

  const onChangeLoop = async (e: Event, soundId: string) => {
    console.log("SoundManager.onChangeLoop", e);
    const { checked } = e.target as HTMLInputElement
    await updateSound({ soundId, criteria: { loop: checked } })
  }
</script>

<Button handle={()=>onClickFileUploadHandler()}>音源のアップロード</Button>
{#if localMusic}
  <figure>
    <figcaption>{localMusic?.name}</figcaption>
    <audio
        autoplay
        controls
        src={localMusic.url}
    ></audio>
  </figure>
{/if}
<ul>
  {#each $sounds as s (s.id)}
    <li>
      <Button handle={()=>onClickSetMusic(s.id)} disabled={s.id===music?.id}>放送</Button>
      <Button handle={()=>onClickUnsetMusic()} disabled={s.id!==music?.id}>停止</Button>
      <Button handle={()=>onClickPlayLocal(s.id)}>試聴</Button>
      <Checkbox label="ループ再生" checked={s.loop} onChange={e=>onChangeLoop(e, s.id)}></Checkbox>
      <span>{s.name}</span></li>
  {/each}
</ul>
