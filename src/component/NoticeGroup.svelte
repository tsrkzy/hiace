<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { useNotices } from "@/model/store/notices";

  const { notices } = useNotices()

</script>

<div style="position: absolute; top: 0px; right: 0px">
  {#each $notices as notice (notice.id)}
    <div class="notice-bar">
      <span>{ notice.text }</span>
    </div>
  {/each}
</div>

<style>
    .notice-bar {
        border-left: 2px solid orangered;
        background-color: dimgray;
        color: ghostwhite;
        margin: 0.5rem;
        padding: 0.5rem;
        max-width: 30vw;
        max-height: 30px;
        white-space: nowrap;
        word-break: keep-all;
        border-radius: 2px;
    }
</style>