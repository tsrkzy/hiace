<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div v-if="show" :style="style"></div>
</template>

<script>
export default {
  name: "Smoke",
  computed: {
    show() {
      return this.$store.getters["smoke/show"];
    },
    style() {
      return {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.2)"
      };
    }
  }
};
</script>

<style scoped></style>
