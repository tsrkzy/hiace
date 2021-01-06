<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <ha-checkbox label="ドラッグ操作での移動を許可する"></ha-checkbox>
    <label>
      <input type="radio" name="grid_type" value="none" />
      <span>グリッドなし</span>
    </label>
    <label>
      <input type="radio" name="grid_type" value="square" />
      <span>直交グリッド</span>
    </label>
    <label>
      <input type="radio" name="grid_type" value="hex" />
      <span>六角グリッド</span>
    </label>
    <img
      :alt="imageId"
      :src="srcUrl"
      style="max-height: 200px;max-width: 200px;"
    />
    <scroll-summary>
      <image-show-case
        v-model="imageId"
        @selectImage="onMapImageChange"
      ></image-show-case>
    </scroll-summary>
  </div>
</template>

<script>
import { FSImage } from "@/collections/Image";
import { FSMap } from "@/collections/Map";
import HaCheckbox from "@/components/atoms/HaCheckbox";
import ImageShowCase from "@/components/molecules/ImageShowCase";
import ScrollSummary from "@/components/organisms/ScrollSummary";
const MAP_NOT_SELECTED = "MAP_NOT_SELECTED";

export default {
  name: "MapEdit",
  components: { ImageShowCase, ScrollSummary, HaCheckbox },
  props: {
    floatId: {
      type: Number,
      require: true
    }
  },
  async created() {
    const float = this.$store.getters["float/info"].find(
      f => f.id === this.floatId
    );
    const mapId = float?.args?.mapId ?? MAP_NOT_SELECTED;
    this.mapId = mapId;

    const map = this.$store.getters["map/info"].find(m => m.id === mapId);
    if (!map) {
      throw new Error(`no map found: ${mapId}`);
    }

    const { image: imageId } = map;
    this.imageId = imageId;
    const { url } = await FSImage.GetById({ id: imageId });
    this.srcUrl = url;
  },
  data() {
    return {
      mapId: null,
      imageId: null,
      srcUrl: null
    };
  },
  methods: {
    async onMapImageChange(imageId) {
      console.log("MapEdit.onMapImageChange", imageId); // @DELETEME
      const { mapId } = this;
      await FSMap.SetImageId(mapId, imageId);

      const { url } = await FSImage.GetById({ id: imageId });
      this.srcUrl = url;
      this.imageId = imageId;
    }
  },
  computed: {
    map() {
      return this.$store.getters["map/info"].find(m => m.id === this.mapId);
    }
  }
};
</script>

<style scoped></style>
