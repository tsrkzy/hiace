<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div v-if="loggedIn" v-show="!nowDragging">
    <float
      v-for="f in floats"
      :key="f.id"
      :float-id="f.id"
      :style="floatStyle(f)"
    >
      <template #content>
        <float-content
          :float-id="f.id"
          :content-id="f.contentId"
        ></float-content>
      </template>
    </float>
  </div>
</template>

<script>
import Float from "@/components/organisms/Float/Float";
import FloatContent from "@/components/organisms/Float/FloatContent";
export default {
  name: "FloatGroup",
  components: { FloatContent, Float },
  computed: {
    floats() {
      return this.$store.getters["float/info"];
    },
    nowDragging() {
      const m = !!this.$store.getters["map/dragging"];
      const p = !!this.$store.getters["pawn/dragging"];
      const b = !!this.$store.getters["board/dragging"];
      return m || p || b;
    },
    loggedIn() {
      return this.$store.getters["auth/loggedIn"];
    }
  },
  methods: {
    floatStyle(f) {
      return {
        zIndex: f.z
      };
    }
  }
};
</script>

<style scoped></style>
