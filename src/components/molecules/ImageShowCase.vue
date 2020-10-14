<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    <label
      v-for="img of imageItems"
      :key="img.id"
      style="display: inline-block;"
    >
      <input
        v-show="false"
        :value="img.id"
        name="image_select"
        type="radio"
        @change="onChangeSelectImage"
      />
      <img
        :alt="img.id"
        :src="img.url"
        :style="{
          'max-width': '24px',
          'max-height': '24px',
          'border-bottom': imageId === img.id ? '1px solid red' : 'none'
        }"
      />
    </label>
  </div>
</template>

<script>
export default {
  name: "ImageShowCase",
  props: {
    imageId: { type: String }
  },
  model: {
    prop: "imageId",
    event: "selectImage"
  },
  methods: {
    onChangeSelectImage(e) {
      const { value } = e.currentTarget;
      this.$emit("selectImage", value);
    }
  },
  computed: {
    imageItems() {
      return this.$store.getters["image/info"].map(img => ({
        id: img.id,
        url: img.url
      }));
    }
  }
};
</script>

<style scoped></style>
