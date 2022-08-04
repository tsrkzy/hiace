<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <input
      type="file"
      multiple
      accept="image/*"
      :value="inputFiles"
      @change="onClickFileUploadHandler"
    />
    <ha-checkbox
      label="削除ボタンを表示する"
      :value="deleteImageMode"
      @input="onClickDeleteMode"
    ></ha-checkbox>
    <fieldset v-show="image">
      <legend>画像の情報</legend>
      <ul v-if="isMine && imageId">
        <li>
          <p>持ち主: {{ whose(imageId) || "-" }}</p>
        </li>
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
            label="#マップ"
            @input="onMakeMap(imageId, $event)"
          ></ha-checkbox>
        </li>
        <li>
          <ha-checkbox
            :value="image.tags.indexOf('character') !== -1"
            label="#キャラクタ"
            @input="onMakeCharacter(imageId, $event)"
          ></ha-checkbox>
        </li>
      </ul>
    </fieldset>
    <fieldset>
      <legend>フィルタ設定(AND)</legend>
      <ul>
        <li>
          <ha-checkbox
            label="自分の画像"
            @input="onChangeOnlyMine($event)"
          ></ha-checkbox>
        </li>
        <li>
          <ha-checkbox
            label="#マップ"
            @input="onChangeOnlyMap($event)"
          ></ha-checkbox>
        </li>
        <li>
          <ha-checkbox
            label="#キャラクタ"
            @input="onChangeOnlyCharacter($event)"
          ></ha-checkbox>
        </li>
      </ul>
    </fieldset>
    <hr />
    <image-show-case
      :image-id="imageId"
      @selectImage="onChangeSelectedImage"
      :only-mine="onlyMine"
      :only-map="onlyMap"
      :only-character="onlyCharacter"
      :delete-mode="deleteImageMode"
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
      inputFiles: null,
      onlyMine: false,
      onlyMap: false,
      onlyCharacter: false,
      deleteImageMode: false
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
    onClickDeleteMode(e) {
      console.log("ImageManager.onClickDeleteMode");
      console.log(e); // @DELETEME
      this.deleteImageMode = e;
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
      this.inputFiles = null;
    },
    onChangeOnlyMine(v) {
      console.log("ImageManager.onChangeOnlyMine", v); // @DELETEME
      this.onlyMine = v;
    },
    onChangeOnlyMap(v) {
      console.log("ImageManager.onChangeOnlyMap", v);
      this.onlyMap = v;
    },
    onChangeOnlyCharacter(v) {
      console.log("ImageManager.onChangeOnlyCharacter", v);
      this.onlyCharacter = v;
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

<style lang="scss" scoped></style>
