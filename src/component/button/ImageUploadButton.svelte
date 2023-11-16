<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->


<script lang="ts">
  import { registerImage } from "@/model/service/ImageSourceService";
  import { useRoom } from "@/model/store/room";
  import { useUsers } from "@/model/store/users";
  import Button from "./Button.svelte";

  const { room } = useRoom();
  const { myUserId } = useUsers();

  const onClickUploadImages = () => {
    console.log("ImageSourceList.onClickUploadImages");
    const inputEl = document.createElement("input");
    inputEl.type = "file";
    inputEl.accept = "image/*";
    inputEl.multiple = true;
    inputEl.addEventListener("change", async (e) => {
      const { files = [] } = e.target as HTMLInputElement;
      if (!files) {
        return;
      }

      const roomId = $room.id
      const userId = $myUserId;

      /* input要素から取得した画像ファイルをアップロードし、firestoreに登録する */
      await Promise.all(Array.from(files).map(f => registerImage(f, roomId, userId)));
    }, false);
    inputEl.click();
  }
</script>

<Button handle={()=>onClickUploadImages()}>画像のアップロード</Button>
