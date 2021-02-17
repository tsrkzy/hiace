<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div
    v-if="show && lines"
    :class="`bs-5 detail-text __hide_on_drag ${leftSide ? 'flip' : ''}`"
  >
    <pre>{{ lines }}</pre>
  </div>
</template>
<script>
export default {
  name: "CharacterDetail",
  props: {},
  computed: {
    lines() {
      return this.$store.getters["detail/lines"];
    },
    show() {
      return this.$store.getters["detail/show"];
    },
    leftSide() {
      return this.$store.getters["detail/leftSide"];
    }
  }
};
</script>

<style scoped lang="scss">
div.detail-text {
  position: absolute;
  border: 1px solid black;
  background-color: cornsilk;
  color: black;
  opacity: 0.9;
  top: 5vh;
  left: 5vw;
  max-height: 90vh;
  max-width: 45vw;
  overflow: hidden;
  width: 40vw;
  padding: 1rem;
  &.flip {
    left: 55vw;
  }
  pre {
    width: 100%;
    white-space: pre-wrap;
    word-break: break-all;
    margin: 0;
    line-height: 1.2;
  }
}
</style>
