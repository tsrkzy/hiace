<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    <label>
      x:{{ x }}
      <input
        type="range"
        min="-100"
        max="100"
        step="10"
        :value="x"
        @change="onChangeOffSetXHandler(mapId, $event)"
      />
    </label>
    <label>
      y:{{ y }}
      <input
        type="range"
        min="-100"
        max="100"
        step="10"
        :value="y"
        @change="onChangeOffSetYHandler(mapId, $event)"
      />
    </label>
    <label>
      scale:{{ scale }}
      <input
        type="range"
        min="50"
        max="200"
        step="10"
        :value="scale"
        @change="onChangeScaleHandler(mapId, $event)"
      />
    </label>
    <img :src="imageUrl" :alt="mapId" :width="24" :height="24" />
    <ha-button @click="onClickDeleteMap(mapId)"
      >DELETE MAP: {{ mapId }}
    </ha-button>
  </div>
</template>

<script>
import { FSImage } from "@/collections/Image";
import { FSMap } from "@/collections/Map";
import HaButton from "@/components/atoms/HaButton";

export default {
  name: "MapEditor",
  components: { HaButton },
  props: {
    mapId: { type: String, require: true }
  },
  data() {
    return {
      image: null
    };
  },
  async created() {
    if (this.map) {
      console.log("load image"); // @DELETEME
      this.image = await FSImage.GetById({ id: this.map.image });
    } else {
      console.log("load map then load image"); // @DELETEME
      const { image } = await FSMap.GetById({ id: this.mapId });
      this.image = await FSImage.GetById({ id: image });
    }
  },
  computed: {
    map() {
      return this.$store.getters["map/info"].find(m => m.id === this.mapId);
    },
    imageUrl() {
      return this.image ? this.image.url : "";
    },
    x() {
      return this.map?.offsetX ?? 0;
    },
    y() {
      return this.map?.offsetY ?? 0;
    },
    scale() {
      return this.map?.scalePp ?? 0;
    }
  },
  methods: {
    async onClickDeleteMap(mapId) {
      await FSMap.Delete(mapId);
    },
    async onChangeOffSetXHandler(mapId, e) {
      const { value } = e.currentTarget;
      await this.updateMapShape(mapId, "offsetX", value);
    },
    async onChangeOffSetYHandler(mapId, e) {
      const { value } = e.currentTarget;
      await this.updateMapShape(mapId, "offsetY", value);
    },
    async onChangeScaleHandler(mapId, e) {
      const { value } = e.currentTarget;
      await this.updateMapShape(mapId, "scalePp", value);
    },
    async updateMapShape(mapId, key, value) {
      const v = parseInt(value, 10);
      if (isNaN(v)) {
        throw new Error("value is NaN");
      }
      await FSMap.Update(mapId, { [key]: v });
    }
  }
};
</script>

<style scoped></style>
