<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    {{ mapId }}
    <ha-checkbox label="ドラッグ操作での移動を許可する"></ha-checkbox>
    <label>
      <span>グリッドなし</span>
      <input type="radio" name="grid_type" value="none" />
    </label>
    <label>
      <span>直交グリッド</span>
      <input type="radio" name="grid_type" value="square" />
    </label>
    <label>
      <span>六角グリッド</span>
      <input type="radio" name="grid_type" value="hex" />
    </label>
    <img
      :alt="imageId"
      :src="srcUrl"
      style="max-height: 200px;max-width: 200px;"
    />
  </div>
</template>

<script>
import { FSImage } from "@/collections/Image";
import HaCheckbox from "@/components/atoms/HaCheckbox";
const MAP_NOT_SELECTED = "MAP_NOT_SELECTED";

export default {
  name: "MapEdit",
  components: { HaCheckbox },
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
  computed: {
    map() {
      return this.$store.getters["map/info"].find(m => m.id === this.mapId);
    }
  }
};
</script>

<style scoped></style>
