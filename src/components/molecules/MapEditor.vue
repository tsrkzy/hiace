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
        step="1"
        v-model="x"
        @change="onChangeOffSetXHandler(mapId, $event)"
      />
    </label>
    <label>
      y:{{ y }}
      <input
        type="range"
        min="-100"
        max="100"
        step="1"
        v-model="y"
        @change="onChangeOffSetYHandler(mapId, $event)"
      />
    </label>
    <label>
      scale:{{ scale }}
      <input
        type="range"
        min="50"
        max="200"
        step="1"
        v-model="scale"
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
      image: null,
      x: 0,
      y: 0,
      scale: 100
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
    }
  },
  methods: {
    async onClickDeleteMap(mapId) {
      await FSMap.Delete(mapId);
    },
    async onChangeOffSetXHandler(mapId, e) {
      console.log(mapId, e); // @DELETEME
    },
    async onChangeOffSetYHandler(mapId, e) {
      console.log(mapId, e); // @DELETEME
    },
    async onChangeScaleHandler(mapId, e) {
      console.log(mapId, e); // @DELETEME
    }
  }
};
</script>

<style scoped></style>
