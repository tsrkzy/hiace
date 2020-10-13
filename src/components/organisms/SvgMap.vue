<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <g
    :id="`map_${this.mapId}`"
    v-if="loaded"
    :style="{
      transform: `translate(${offsetX}px, ${offsetY}px) scale(${z})`
    }"
  >
    <text>{{ imageId }}, {{ width }}, {{ height }}</text>
    <image :width="width" :height="height" :href="href"></image>
    <rect
      :width="width"
      :height="height"
      stroke="red"
      fill="transparent"
    ></rect>
  </g>
</template>

<script>
import { FSImage } from "@/collections/Image";
import { FSMap } from "@/collections/Map";

export default {
  name: "SvgMap",
  props: {
    mapId: { type: String }
  },
  computed: {
    z() {
      return this.scalePp / 100;
    },
    image() {
      const id = this.imageId;
      return this.$store.getters["image/info"].find(img => img.id === id);
    },
    map() {
      const id = this.mapId;
      return this.$store.getters["map/info"].find(m => m.id === id);
    },
    offsetX() {
      return this.map.offsetX;
    },
    offsetY() {
      return this.map.offsetY;
    },
    scalePp() {
      return this.map.scalePp;
    }
  },
  data() {
    return {
      /* image */
      imageId: null,
      width: 0,
      height: 0,
      href: null,

      loaded: false
    };
  },
  async created() {
    if (!this.mapId) {
      return false;
    }

    const { image } = await FSMap.GetById({
      id: this.mapId
    });
    const { url, width, height } = await FSImage.GetById({ id: image });

    /* image */
    this.imageId = image;
    this.width = width;
    this.height = height;
    this.href = url;

    this.loaded = true;
  }
};
</script>

<style scoped></style>
