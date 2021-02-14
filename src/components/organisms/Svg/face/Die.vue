<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <g>
    <rect
      :stroke="color"
      stroke-width="1"
      :fill="color"
      fill-opacity=".8"
      x="0"
      y="0"
      :rx="diceSize / 6"
      :ry="diceSize / 6"
      :width="diceSize"
      :height="diceSize"
    ></rect>
    <circle
      :key="i"
      v-for="(d, i) in eyes"
      :data-d="d"
      :data-i="i"
      :r="d[0]"
      :cx="d[1]"
      :cy="d[2]"
      fill="white"
      fill-opacity=".95"
    ></circle>
  </g>
</template>

<script>
export default {
  name: "Die",
  props: {
    color: { type: String, default: "black" },
    dice: { type: String, require: true },
    diceSize: { type: Number, default: 120 }
  },
  computed: {
    eyes() {
      const dice = this.dice;
      const d = this.diceSize;
      const p = d / 24;
      const result = [];
      switch (dice) {
        case "ONE": {
          result.push([d / 5, d / 2, d / 2]);
          break;
        }
        case "TWO": {
          result.push([d / 8, p + d / 5, p + d / 5]);
          result.push([d / 8, d - (p + d / 5), d - (p + d / 5)]);
          break;
        }
        case "THREE": {
          result.push([d / 8, p + d / 5, p + d / 5]);
          result.push([d / 8, d / 2, d / 2]);
          result.push([d / 8, d - (p + d / 5), d - (p + d / 5)]);
          break;
        }
        case "FOUR": {
          result.push([d / 8, p + d / 5, p + d / 5]);
          result.push([d / 8, d - (p + d / 5), p + d / 5]);
          result.push([d / 8, p + d / 5, d - (p + d / 5)]);
          result.push([d / 8, d - (p + d / 5), d - (p + d / 5)]);
          break;
        }
        case "FIVE": {
          result.push([d / 8, p + d / 5, p + d / 5]);
          result.push([d / 8, d - (p + d / 5), p + d / 5]);
          result.push([d / 8, d / 2, d / 2]);
          result.push([d / 8, p + d / 5, d - (p + d / 5)]);
          result.push([d / 8, d - (p + d / 5), d - (p + d / 5)]);
          break;
        }
        case "SIX": {
          result.push([d / 8, 2 * p + d / 5, p + d / 5]);
          result.push([d / 8, d - (2 * p + d / 5), p + d / 5]);
          result.push([d / 8, 2 * p + d / 5, d / 2]);
          result.push([d / 8, d - (2 * p + d / 5), d / 2]);
          result.push([d / 8, 2 * p + d / 5, d - (p + d / 5)]);
          result.push([d / 8, d - (2 * p + d / 5), d - (p + d / 5)]);
          break;
        }
      }

      return result;
    }
  }
};
</script>
