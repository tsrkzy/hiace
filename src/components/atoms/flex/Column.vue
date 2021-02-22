<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div :class="`col-${cols}`"><slot></slot></div>
</template>

<script>
export default {
  name: "Column",
  props: {
    cols: { type: String, default: "2" }
  }
};
</script>

<style scoped lang="scss">
.col-2 {
  flex: 2 100%;
  margin: 0;
  padding: 0;
}
.col-1 {
  flex: 1 50%;
  margin: 0;
  padding: 0;
}
</style>
