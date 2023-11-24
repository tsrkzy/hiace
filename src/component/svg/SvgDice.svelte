<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { DICE_SIZE, DiceColors, DiceEyeColors, DiceValues } from "@/constant";
  import { useDices } from "@/model/store/dices";
  import { toCSS } from "@/util/style";
  import Aster from "@/component/svg/Aster.svelte";
  import Die from "@/component/svg/Die.svelte";
  import { Dice } from "@/model/Dice";

  export let diceId: string;
  export let shadow: boolean = false;

  const { dices } = useDices();


  $: isRender = (() => {
    return true
  })()
  $: dragged = false
  $: dice = $dices.find(dice => dice.id === diceId) as Dice
  $: isAster = dice?.face === DiceValues.ASTER

  $: frameColor = DiceEyeColors[dice.color]
  $: diceColor = dice.color || DiceColors.DICE_BLACK;
  $: face = dice.face || DiceValues.ONE

  $: diceStyleStr = toCSS({
    transform: `${dice?.transform}`
  })

  export const onMouseDown = async () => {
    console.log("SvgDice.onMouseDown");
  }
</script>

{#if isRender}
  <g id={shadow ? `shadow_dice_${diceId}` : `dice_${diceId}`}
     style={diceStyleStr}
     class="token-transition"
     on:mousedown={()=>onMouseDown()}>
    <!-- 外枠 -->
    <rect
        width={DICE_SIZE}
        height={DICE_SIZE}
        stroke={frameColor}
        fill="rgba(0,0,0,0.2)"
    ></rect>
    <!-- ダイスの面と目 -->
    {#if !shadow}
      <g>
        {#if isAster }
          <Aster
              dice={face}
              color={diceColor}
              diceSize={DICE_SIZE}
          ></Aster>
        {:else }
          <Die
              dice={face}
              color={diceColor}
              diceSize={DICE_SIZE}
          ></Die>
        {/if             }
      </g>
    {/if}
    <!-- ドラッグ中の当たり判定拡張 -->
    {#if dragged}
      <rect
          x={-1000 / 2}
          y={-1000 / 2}
          width={DICE_SIZE + 1000}
          height={DICE_SIZE + 1000}
          stroke="transparent"
          fill="transparent"
      ></rect>
    {/if}
  </g>
{/if}