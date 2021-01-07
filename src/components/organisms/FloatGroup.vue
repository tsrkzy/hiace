<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div v-if="!nowDragging">
    <float
      class="float"
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
import Float from "@/components/organisms/Float";
import FloatContent from "@/components/organisms/FloatContent";
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
      return m || p;
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
