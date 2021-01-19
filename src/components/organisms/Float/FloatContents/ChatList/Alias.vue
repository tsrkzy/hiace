<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div
    :style="{
      borderLeft: 'solid 1px black',
      maxHeight: '100%',
      position: 'absolute',
      top: 0,
      left: `calc(${chatPosition} * 90% / 12)`,
      height: `${height}px`
    }"
  >
    <span
      style="
        position: absolute;
        top: 0;
        left: 0;
        background: linear-gradient(-0.25turn, dimgray, black);
        color: white;
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;"
      >{{ billBoard }}</span
    >
    <img :alt="image" :src="srcUrl" style="max-height: 100%;" />
  </div>
</template>
<script>
import { FSImage } from "@/collections/Image";
import { getName } from "@/scripts/helper";

export default {
  name: "alias",
  props: {
    characterId: { type: String, require: true },
    aliasId: { type: String, require: true },
    chatPosition: { type: Number, require: true },
    image: { type: String, require: true }
  },
  async created() {
    await this.reloadImage(this.image);
  },
  data() {
    return {
      width: null,
      height: null,
      srcUrl: null
    };
  },
  computed: {
    billBoard() {
      const characterId = this.characterId;
      const aliasId = this.aliasId;
      const cName = getName("character", characterId);
      const aName = getName("alias", aliasId);
      return `${cName}(${aName})`;
    }
  },
  methods: {
    async reloadImage(image) {
      if (!image) {
        return false;
      }
      const { url, width, height } = await FSImage.GetById({ id: image });
      this.width = width;
      this.height = height;
      this.srcUrl = url;
    }
  },
  watch: {
    async image(image) {
      await this.reloadImage(image);
    }
  }
};
</script>
