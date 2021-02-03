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
    <span class="billboard">{{ billBoard }}</span>
    <div :class="`balloon-holder alias-${characterId}`">
      <svg xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="40" cy="25" rx="2" ry="2" class="mumble"></ellipse>
        <ellipse cx="40" cy="16" rx="5" ry="5" class="mumble"></ellipse>
        <ellipse cx="21" cy="11" rx="20" ry="10" class="mumble"></ellipse>
        <ellipse cx="10" cy="11" rx="1" ry="1" class="mumble dot"></ellipse>
        <ellipse cx="20" cy="11" rx="1" ry="1" class="mumble dot"></ellipse>
        <ellipse cx="30" cy="11" rx="1" ry="1" class="mumble dot"></ellipse>
      </svg>
    </div>
    <img class="alias" :alt="image" :src="srcUrl" />
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
<style lang="scss" scoped>
div.balloon-holder {
  position: absolute;
  top: -30px;
  left: 10px;
  opacity: 0;
  &.dimming {
    animation: dim 800ms linear both;
  }
}
img.alias {
  max-height: 100%;
}
span.billboard {
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(-0.25turn, dimgray, black);
  opacity: 0.7;
  color: white;
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
svg {
  width: 100px;
  height: 30px;
  ellipse.mumble {
    stroke: dimgray;
    fill: white;
    &.dot {
      stroke: none;
      fill: dimgray;
    }
  }
}

@keyframes dim {
  0% {
    display: block;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 0.5;
  }
  100% {
    display: none;
    opacity: 0;
  }
}
</style>
