<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%; height:100%;">
    <div v-if="contentId === 1">1</div>
    <div v-else-if="contentId === 2">2</div>
    <div v-else-if="contentId === 3">3</div>
    <div v-else-if="contentId === 4">4</div>
    <div v-else>content not found: {{ contentId }}</div>
  </div>
</template>

<script>
export default {
  name: "FloatContent",
  props: {
    contentId: {
      type: Number,
      require: true
    }
  }
};
</script>

<style scoped></style>
