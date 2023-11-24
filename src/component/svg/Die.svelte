<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">

  import { DiceBaseColors, type DiceColor, DiceEyeColors, DiceValues } from "@/constant";

  export let dice: string;
  export let color: DiceColor;
  export let diceSize: number;

  $: baseColor = DiceBaseColors[color]
  $: eyeColor = DiceEyeColors[color]
  $: eyes = (() => {
    const d = diceSize;
    const p = d / 24;
    const result = [];
    switch (dice) {
      case DiceValues.ONE: {
        result.push([d / 5, d / 2, d / 2]);
        break;
      }
      case DiceValues.TWO: {
        result.push([d / 8, p + d / 5, p + d / 5]);
        result.push([d / 8, d - (p + d / 5), d - (p + d / 5)]);
        break;
      }
      case DiceValues.THREE: {
        result.push([d / 8, p + d / 5, p + d / 5]);
        result.push([d / 8, d / 2, d / 2]);
        result.push([d / 8, d - (p + d / 5), d - (p + d / 5)]);
        break;
      }
      case DiceValues.FOUR: {
        result.push([d / 8, p + d / 5, p + d / 5]);
        result.push([d / 8, d - (p + d / 5), p + d / 5]);
        result.push([d / 8, p + d / 5, d - (p + d / 5)]);
        result.push([d / 8, d - (p + d / 5), d - (p + d / 5)]);
        break;
      }
      case DiceValues.FIVE: {
        result.push([d / 8, p + d / 5, p + d / 5]);
        result.push([d / 8, d - (p + d / 5), p + d / 5]);
        result.push([d / 8, d / 2, d / 2]);
        result.push([d / 8, p + d / 5, d - (p + d / 5)]);
        result.push([d / 8, d - (p + d / 5), d - (p + d / 5)]);
        break;
      }
      case DiceValues.SIX: {
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

  })();
</script>

<g>
  <rect
      stroke={baseColor}
      fill={baseColor}
      class={baseColor}
      stroke-width="1"
      fill-opacity=".9"
      x="0"
      y="0"
      rx={diceSize / 6}
      ry={diceSize / 6}
      width={diceSize}
      height={diceSize}
  ></rect>
  {#each eyes as d,i}
    <circle
        data-d={d}
        data-i={i}
        r={d[0]}
        cx={d[1]}
        cy={d[2]}
        class={eyeColor}
        fill={eyeColor}
        fill-opacity=".95"
    ></circle>
  {/each}
</g>