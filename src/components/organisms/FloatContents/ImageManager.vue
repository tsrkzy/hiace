<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <p>持ち主: {{ whose(image) || "-" }}</p>
    <ol style="padding-left: 0;">
      <li>
        <ha-checkbox
          :disabled="!image"
          label="他のユーザから隠す"
          :v-model="makeHidden"
          @input="onMakeHidden(image, $event)"
        ></ha-checkbox>
      </li>
      <li>
        <ha-checkbox
          :disabled="!image"
          label="マップとしてタグ付け"
          :v-model="toMap"
        ></ha-checkbox>
      </li>
      <li>
        <ha-checkbox
          :disabled="!image"
          label="キャラクタとしてタグ付け"
          :v-model="toCharacter"
        ></ha-checkbox>
      </li>
    </ol>
    <hr />
    <input
      type="file"
      multiple
      accept="image/*"
      @change="onClickFileUploadHandler"
    />
    <div>
      <ha-checkbox
        :disabled="!image"
        label="自分の画像だけ表示"
        :v-model="onlyMine"
      ></ha-checkbox>
    </div>
    <image-show-case
      v-model="image"
      @selectImage="onChangeSelectedImage"
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
      image: null,
      onlyMine: false,
      makeHidden: false,
      toMap: false,
      toCharacter: false
    };
  },
  computed: {
    imageItems() {
      return this.$store.getters["image/info"];
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
    onChangeSelectedImage(imageId) {
      const image = this.$store.getters["image/info"].find(
        i => i.id === imageId
      );
      const { hidden } = image;
      this.makeHidden = hidden;
    },
    async onMakeHidden(imageId, value) {
      console.log("ImageManager.onMakeHidden", imageId, value); // @DELETEME
      await FSImage.Update(imageId, { hidden: value });
    }
  }
};
</script>

<style scoped></style>
