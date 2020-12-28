<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <div v-if="image">
      <p>持ち主: {{ whose(imageId) || "-" }}</p>
      <p>タグ: {{ image.tags }}</p>
      <ol v-if="isMine && imageId" style="padding-left: 0;">
        <li>
          <ha-checkbox
            label="他のユーザから隠す"
            :value="image.hidden"
            @input="onMakeHidden(imageId, $event)"
          ></ha-checkbox>
        </li>
        <li>
          <ha-checkbox
            :value="image.tags.indexOf('map') !== -1"
            label="マップとしてタグ付け"
            @input="onMakeMap(imageId, $event)"
          ></ha-checkbox>
        </li>
        <li>
          <ha-checkbox
            :value="image.tags.indexOf('character') !== -1"
            label="キャラクタとしてタグ付け"
            @input="onMakeCharacter(imageId, $event)"
          ></ha-checkbox>
        </li>
      </ol>
      <hr />
    </div>
    <input
      type="file"
      multiple
      accept="imageId/*"
      @change="onClickFileUploadHandler"
    />
    <div>
      <ha-checkbox
        label="自分の画像だけ表示"
        @input="onChangeOnlyMine($event)"
      ></ha-checkbox>
    </div>
    <image-show-case
      v-model="imageId"
      @selectImage="onChangeSelectedImage"
      :only-mine="onlyMine"
    ></image-show-case>
  </div>
</template>

<script>
import { FSImage } from "@/collections/Image";
import HaCheckbox from "@/components/atoms/HaCheckbox";
import ImageShowCase from "@/components/molecules/ImageShowCase";
export default {
  name: "ImageManager",
  components: { HaCheckbox, ImageShowCase },
  props: {
    floatId: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      imageId: null,
      onlyMine: false
    };
  },
  computed: {
    image() {
      return this.$store.getters["image/info"].find(
        img => img.id === this.imageId
      );
    },
    isMine() {
      return (
        this.image && this.image.owner === this.$store.getters["auth/user"].id
      );
    }
  },
  methods: {
    whose(imageId) {
      return FSImage.Whose(imageId);
    },
    async onClickFileUploadHandler(e) {
      console.log("ImageManager.onClickFileUploadHandler"); // @DELETEME
      const { files = [] } = e.currentTarget;

      const promiseList = [];
      files.forEach(f => {
        promiseList.push(FSImage.Create(f));
      });
      await Promise.all(promiseList);

      /* アップロードに成功したら空にする */
      e.currentTarget.value = "";
    },
    onChangeOnlyMine(v) {
      console.log("ImageManager.onChangeOnlyMine", v); // @DELETEME
      this.onlyMine = v;
    },
    onChangeSelectedImage(imageId) {
      console.log("ImageManager.onChangeSelectedImage", imageId); // @DELETEME
      this.imageId = imageId;
    },
    async onMakeHidden(imageId, value) {
      console.log("ImageManager.onMakeHidden", imageId, value); // @DELETEME
      await FSImage.Update(imageId, { hidden: value });
    },
    async onMakeMap(imageId, value) {
      console.log("ImageManager.onMakeMap"); // @DELETEME
      await FSImage.Tag(imageId, "map", value);
    },
    async onMakeCharacter(imageId, value) {
      console.log("ImageManager.onMakeCharacter"); // @DELETEME
      await FSImage.Tag(imageId, "character", value);
    }
  }
};
</script>

<style scoped></style>
