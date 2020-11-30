<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
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
