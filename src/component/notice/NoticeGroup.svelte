<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { useNotices } from "@/model/store/notices";
  import NoticeBar from "@/component/notice/NoticeBar.svelte";

  const { notices } = useNotices()

</script>

<div class="notice-group">
  {#each $notices as notice (notice.id)}
    <NoticeBar>{notice.text}</NoticeBar>
  {/each}
</div>

<style lang="scss">
  .notice-group {
    position: absolute;
    top: 0;
    right: 0
  }
</style>