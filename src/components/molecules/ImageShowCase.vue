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
    <label v-if="showNull && images.length" style="display: inline-block">
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
        <div class="null-image__inner-frame">
          <span>指定しない</span>
        </div>
      </div>
    </label>
    <label
      v-for="image in images"
      :key="image.id"
      style="display: inline-block"
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
          style="
            position: absolute;
            left: 0;
            top: 0;
            color: white;
            background-color: red;
          "
          >個人</span
        >
        <ha-button
          v-if="deleteMode"
          style="position: absolute; right: 0; bottom: 0"
          @click="onClickDeleteImage(image.id)"
          >削除</ha-button
        >
      </div>
    </label>
  </div>
</template>

<script>
import { FSImage } from "@/collections/Image";
import HaButton from "@/components/atoms/HaButton";
import { IMAGE_MANAGER } from "@/interfaces/IFFloat";
import { Smoke } from "@/scripts/Smoke";

export default {
  name: "ImageShowCase",
  components: { HaButton },
  props: {
    imageId: { type: String },
    onlyMine: { type: Boolean, default: false },
    onlyMap: { type: Boolean, default: false },
    onlyCharacter: { type: Boolean, default: false },
    onlyUntagged: { type: Boolean, default: false },
    navToImageManager: { type: Boolean, default: false },
    deleteMode: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    showNull: { type: Boolean, default: false },
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
        show: true,
      });
    },
    async onClickDeleteImage(imageId) {
      console.log("ImageShowCase.onClickDeleteImage", imageId);
      await Smoke.on();
      await FSImage.Archive(imageId);
      await Smoke.off();
    },
  },
  computed: {
    me() {
      return this.$store.getters["auth/user"].id;
    },
    images() {
      const images = this.$store.getters["image/info"].filter((img) => {
        return (
          /* 自分の所有しないhidden属性付きの画像は表示しない */
          !(img.owner !== this.me && img.hidden) &&
          /* アーカイブされていない画像のみ表示する */
          img.archived !== true
        );
      });

      /* フィルタオプション
       *「自分の画像」
       *「マップ」
       *「キャラクタ」
       *「未タグ付け」*/
      const { onlyMine, onlyMap, onlyCharacter, onlyUntagged } = this;
      return images.filter((img) => {
        const isMine = onlyMine ? img.owner === this.me : true;
        const isMap = onlyMap ? img.tags.indexOf("map") !== -1 : true;
        const isCharacter = onlyCharacter
          ? img.tags.indexOf("character") !== -1
          : true;
        const isUntagged = onlyUntagged && img.tags.length === 0;

        return isMine && (onlyUntagged ? isUntagged : isMap && isCharacter);
      });
    },
  },
  watch: {
    imageItems() {
      const images = this.images;
      for (let i = 0; i < images.length; i++) {
        const { id } = images[i];
        FSImage.SafeReloadUrl(id);
      }
    },
  },
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

  div.null-image__inner-frame {
    position: absolute;
    left: 0;
    top: 0;
    max-width: 64px;
    max-height: 64px;
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
