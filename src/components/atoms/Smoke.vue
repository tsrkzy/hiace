<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div v-if="show" class="smoke"></div>
</template>

<script>
export default {
  name: "Smoke",
  computed: {
    show() {
      return this.$store.getters["smoke/show"];
    },
  },
};
</script>

<style scoped lang="scss">
div.smoke {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(0.5px);
  z-index: 1;
}
</style>
