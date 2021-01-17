<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <details
    ><summary>画像を選択する</summary>
    <div style="width: 100%;max-height:192px;overflow-y: scroll;">
      <slot></slot>
    </div>
  </details>
</template>

<script>
export default {
  name: "ScrollSummary"
};
</script>

<style scoped></style>
