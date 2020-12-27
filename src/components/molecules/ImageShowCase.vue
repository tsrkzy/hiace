<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    <label
      v-for="img in imageItems"
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
        @click="onClickImage(img.id)"
        :alt="img.id"
        :src="img.url"
        :style="{
          maxWidth: '64px',
          maxHeight: '64px',
          border: imageId === img.id ? '1px dashed red' : 'none'
        }"
      />
    </label>
  </div>
</template>

<script>
import { FSImage } from "@/collections/Image";

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
    },
    onClickImage(imageId) {
      this.$emit("selectImage", imageId);
    }
  },
  computed: {
    imageItems() {
      return this.$store.getters["image/info"].map(img => ({
        id: img.id,
        url: img.url
      }));
    }
  },
  watch: {
    imageItems() {
      const images = this.imageItems;
      for (let i = 0; i < images.length; i++) {
        const { id } = images[i];
        FSImage.SafeReloadUrl(id);
      }
    }
  }
};
</script>

<style scoped></style>
