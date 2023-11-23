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

  export let float: Float;

  const { sounds } = useSounds()
  const { room } = useRoom()
  const { myUserId } = useUsers()


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
</script>
<Button handle={()=>onClickFileUploadHandler()}>音源のアップロード</Button>
{#each $sounds as sound (sound.id)}
  <p>{sound.name}</p>
{/each}