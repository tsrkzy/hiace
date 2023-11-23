<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { Float } from "@/model/Float";
  import { useSounds } from "@/model/store/sounds";
  import Button from "@/component/button/Button.svelte";
  import { registerSound } from "@/model/service/SoundService";
  import { useRoom } from "@/model/store/room";
  import { useUsers } from "@/model/store/users";
  import { updateRoom } from "@/model/service/RoomService";

  export let float: Float;

  const { sounds } = useSounds()
  const { room } = useRoom()
  const { myUserId } = useUsers()

  // roomに設定されているsoundId
  $: music = $sounds.find(s => s.id === $room.music)

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
</script>
<Button handle={()=>onClickFileUploadHandler()}>音源のアップロード</Button>
<ul>

  {#each $sounds as s (s.id)}
    <li>
      <Button handle={()=>onClickSetMusic(s.id)} disabled={s.id===music?.id}>再生</Button>
      <Button handle={()=>onClickUnsetMusic()} disabled={s.id!==music?.id}>停止</Button>
      <Button>視聴</Button>
      <span>{s.name}</span></li>
  {/each}
</ul>
