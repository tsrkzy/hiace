<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <g>
    <rect
      :stroke="baseColor"
      stroke-width="1"
      :fill="baseColor"
      fill-opacity=".9"
      x="0"
      y="0"
      :rx="diceSize / 6"
      :ry="diceSize / 6"
      :width="diceSize"
      :height="diceSize"
    ></rect>
    <path
      :stroke="eyeColor"
      stroke-opacity=".95"
      stroke-width="15"
      stroke-linecap="round"
      stroke-linejoin="round"
      :d="d"
    ></path>
  </g>
</template>

<script>
import {
  DICE_BASE_COLOR,
  DICE_BLACK,
  DICE_EYE_COLOR,
  DICE_SIZE,
} from "@/collections/Dice";

export default {
  name: "Aster",
  props: {
    color: { type: String, default: DICE_BLACK },
    diceSize: { type: Number, default: DICE_SIZE },
  },
  computed: {
    baseColor() {
      return DICE_BASE_COLOR[this.color];
    },
    eyeColor() {
      return DICE_EYE_COLOR[this.color];
    },
    d() {
      const s = this.diceSize;
      const p = s / 4;
      const c = s / 2;
      const l = c - p;

      const D90 = Math.PI / 2;
      const D360 = 2 * Math.PI;
      const nodes = [0, 1, 2].map((i) => [
        c + l * Math.cos(D90 + (D360 * i) / 6),
        c + l * Math.sin(D90 + (D360 * i) / 6),
        c + l * Math.cos(D90 + (D360 * i) / 6) * -1,
        c + l * Math.sin(D90 + (D360 * i) / 6) * -1,
      ]);

      return `
      M ${nodes[0][0]},${nodes[0][1]}
      L ${nodes[0][2]},${nodes[0][3]}
      M ${nodes[1][0]},${nodes[1][1]}
      L ${nodes[1][2]},${nodes[1][3]}
      M ${nodes[2][0]},${nodes[2][1]}
      L ${nodes[2][2]},${nodes[2][3]}
      Z`;
    },
  },
};
</script>
