<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="position: fixed; top: 0px; right: 0px;">
    <div :key="notice.id" v-for="notice in notices" class="notice-bar">
      <span>{{ notice.text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Notice",
  computed: {
    notices() {
      return this.$store.getters["notice/info"];
    }
  }
};
</script>

<style scoped>
.notice-bar {
  border-left: 2px solid orangered;
  background-color: dimgray;
  color: ghostwhite;
  margin: 0.5rem;
  padding: 0 1rem;
  max-width: 150px;
  word-break: break-word;
  white-space: normal;
  border-radius: 2px;
}
</style>
