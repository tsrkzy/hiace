<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    <float v-for="f in floats" :key="f.id" :float-id="f.id"></float>
  </div>
</template>

<script>
import Float from "@/components/organisms/Float";
export default {
  name: "FloatGroup",
  components: { Float },
  computed: {
    floats() {
      return this.$store.getters["float/info"];
    }
  }
};
</script>

<style scoped></style>
