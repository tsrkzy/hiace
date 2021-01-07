<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <ha-checkbox
      label="ドラッグで位置変更する"
      @input="onChangeOffsetLock"
    ></ha-checkbox>
    <fieldset>
      <legend>サイズの拡縮: {{ scaleValue }}%</legend>
      <label>
        <input
          type="range"
          min="25"
          max="300"
          step="10"
          :value="scaleValue"
          @change="onChangeScaleHandler"
        />
        <span></span>
      </label>
    </fieldset>
    <fieldset disabled>
      <legend>グリッドタイプ(未実装)</legend>
      <label>
        <input type="radio" name="grid_type" value="none" />
        <span>なし</span>
      </label>
      <label>
        <input type="radio" name="grid_type" value="square" />
        <span>直交</span>
      </label>
      <label>
        <input type="radio" name="grid_type" value="hex" />
        <span>六角</span>
      </label>
    </fieldset>
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

    const { image: imageId, transform } = map;
    const t = new DOMMatrix(transform);
    this.originTransform = t;

    const scale = t.a * t.d - t.b * t.c;
    this.scaleValue = scale * 100;

    this.imageId = imageId;
    const { url } = await FSImage.GetById({ id: imageId });
    this.srcUrl = url;
  },
  data() {
    return {
      mapId: null,
      imageId: null,
      srcUrl: null,
      originTransform: new DOMMatrix(),
      /* 拡大率(%) */
      scaleValue: 100
    };
  },
  methods: {
    async onChangeScaleHandler(e) {
      const { value } = e.currentTarget;
      const scale = value / 100;
      const ot = this.originTransform;
      /* マップの回転は想定していない */
      const transform = new DOMMatrix([scale, 0, 0, scale, ot.e, ot.f]);

      await FSMap.Update(this.mapId, { transform: `${transform}` });
    },
    onChangeOffsetLock(checked) {
      const offsetLock = !!checked;
      FSMap.Update(this.mapId, { offsetLock });
    },
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
