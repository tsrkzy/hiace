<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <g
    :id="`pawn_${this.pawnId}`"
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
import { FSPawn } from "@/collections/Pawn";

export default {
  name: "SvgPawn",
  props: {
    pawnId: { type: String, require: true }
  },
  computed: {
    z() {
      return this.scalePp / 100;
    },
    image() {
      const id = this.imageId;
      return this.$store.getters["image/info"].find(img => img.id === id);
    },
    pawn() {
      const id = this.pawnId;
      return this.$store.getters["pawn/info"].find(m => m.id === id);
    },
    offsetX() {
      return this.pawn.offsetX;
    },
    offsetY() {
      return this.pawn.offsetY;
    },
    scalePp() {
      return this.pawn.scalePp;
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
    if (!this.pawnId) {
      return false;
    }

    const { image } = await FSPawn.GetById({
      id: this.pawnId
    });

    if (!image) {
      console.warn(`pawn ${this.pawnId} has no image`);
      return false;
    }
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
