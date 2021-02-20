<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    <ha-button
      v-if="navToImageManager && !images.length"
      @click="onOpenImageManager"
      >画像をアップロード</ha-button
    >
    <label v-if="showNull && images.length" style="display: inline-block;">
      <!-- 外枠 -->
      <div :class="`image-frame ${imageId ? '' : 'selected'}`">
        <input
          :disabled="disabled"
          v-show="false"
          :value="null"
          name="image_select"
          type="radio"
          @change="onChangeSelectImage"
        />
        <div
          :style="{
            position: 'absolute',
            left: 0,
            top: 0,
            maxWidth: '64px',
            maxHeight: '64px'
          }"
        >
          <span>指定しない</span>
        </div>
      </div>
    </label>
    <label
      v-for="image in images"
      :key="image.id"
      style="display: inline-block;"
    >
      <!-- 外枠 -->
      <div :class="`image-frame ${imageId === image.id ? 'selected' : ''}`">
        <input
          :disabled="disabled"
          v-show="false"
          :value="image.id"
          name="image_select"
          type="radio"
          @change="onChangeSelectImage"
        />
        <img :alt="image.id" :src="image.url" />
        <span
          v-if="isHidden(image)"
          style="position:absolute;left:0;top:0;color:white;background-color: red;"
          >個人</span
        >
      </div>
    </label>
  </div>
</template>

<script>
import { FSImage } from "@/collections/Image";
import HaButton from "@/components/atoms/HaButton";
import { IMAGE_MANAGER } from "@/interfaces/IFFloat";

export default {
  name: "ImageShowCase",
  components: { HaButton },
  props: {
    imageId: { type: String },
    onlyMine: { type: Boolean, default: false },
    navToImageManager: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    showNull: { type: Boolean, default: false }
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
    isHidden(image) {
      return image && image.hidden && image.owner === this.me;
    },
    onOpenImageManager() {
      this.$store.dispatch("float/create", {
        contentId: IMAGE_MANAGER,
        show: true
      });
    }
  },
  computed: {
    me() {
      return this.$store.getters["auth/user"].id;
    },
    images() {
      const images = this.$store.getters["image/info"].filter(img => {
        /* 自分の所有しないhidden属性付きの画像は表示しない */
        return !(img.owner !== this.me && img.hidden);
      });

      /* 「自分の画像だけ表示」オプション */
      return this.onlyMine
        ? images.filter(img => img.owner === this.me)
        : images;
    }
  },
  watch: {
    imageItems() {
      const images = this.images;
      for (let i = 0; i < images.length; i++) {
        const { id } = images[i];
        FSImage.SafeReloadUrl(id);
      }
    }
  }
};
</script>

<style scoped lang="scss">
div.image-frame {
  position: relative;
  width: 64px;
  height: 64px;
  margin: 0 1px;
  border: 1px solid lightgray;
  background-color: transparent;
  &.selected {
    border: 1px dotted red;
    background-color: lightsalmon;
  }
  img {
    position: absolute;
    left: 0;
    top: 0;
    max-width: 64px;
    max-height: 64px;
  }
}
</style>
