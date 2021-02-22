<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div class="flex-container"><slot></slot></div>
</template>

<script>
export default {
  name: "Container"
};
</script>

<style scoped lang="scss">
.flex-container {
  display: flex;
  flex: 100%;
  flex-flow: row wrap;
}
</style>
