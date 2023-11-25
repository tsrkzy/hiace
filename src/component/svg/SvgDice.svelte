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
  import { touchDice, updateDice } from "@/model/service/DiceService";
  import { useBoards } from "@/model/store/boards";
  import { useRoom } from "@/model/store/room";
  import { usePawns } from "@/model/store/pawns";

  export let diceId: string;
  export let shadow: boolean = false;

  const { draggedPawnId } = usePawns();
  const { dices, draggedDiceId, setDraggedDiceId } = useDices();
  const { boards } = useBoards();
  const { room } = useRoom();

  $: activeBoard = $boards.find(b => b.id === $room.activeBoard)
  $: dragged = $draggedDiceId === diceId
  $: dice = $dices.find(dice => dice.id === diceId) as Dice
  $: isAster = dice?.face === DiceValues.ASTER

  $: frameColor = DiceEyeColors[dice.color]
  $: diceColor = dice.color || DiceColors.DICE_BLACK;
  $: face = dice.face || DiceValues.ONE

  $: diceStyleStr = toCSS({
    transform: `${dice?.transform}`
  })

  $: isRender = (() => {
    if (shadow) {
      return $draggedDiceId;
    } else {
      return (!$draggedDiceId && !$draggedPawnId) || dragged;
    }
  })()
  export const onMouseDown = async (e: MouseEvent) => {
    console.log("SvgDice.onMouseDown");
    e.stopPropagation()
    e.preventDefault()


    const diceEl = document.getElementById(`dice_${diceId}`) as HTMLElement&SVGGElement
    const boardEl = document.getElementById(`board_${activeBoard?.id}`) as HTMLElement&SVGGElement;

    if (!diceEl || !boardEl) {
      console.error("SvgDice.onMouseDown: diceEl or boardEl is null");
      return false;
    }

    setDraggedDiceId(diceId)
    diceEl.classList.remove("token-transition");

    const downX = e.clientX;
    const downY = e.clientY;

    /* globalの座標系をboard,diceの座標系へ変換する行列 */
    const ctmB = boardEl.getCTM() as DOMMatrix; // global -> board
    const ctmD = diceEl.getCTM() as DOMMatrix; // global -> dice
    const ctmBd = ctmB.inverse().multiply(ctmD); // board -> dice

    function globalToLocal(dx: number, dy: number) {
      /* 変位をglobalからDOMローカルの座標系へ変換 */
      return new DOMMatrix([1, 0, 0, 1, dx / ctmD.a, dy / ctmD.a]).translate(
        ctmBd.e,
        ctmBd.f
      );
    }

    const onMove = (e: MouseEvent) => {
      e.stopPropagation();
      const t = globalToLocal(e.clientX - downX, e.clientY - downY);
      dice.transform = `${t}`;
    };

    const onMouseUp = async (e: MouseEvent) => {
      console.log("SvgDice.onMouseUp");
      e.stopPropagation();


      setDraggedDiceId("")

      diceEl.classList.add("token-transition");
      diceEl.removeEventListener("mousemove", onMove);
      diceEl.removeEventListener("mouseup", onMouseUp);
      diceEl.removeEventListener("mouseleave", onMouseUp);

      const newTransform = `${globalToLocal(e.clientX - downX, e.clientY - downY)}`;

      await updateDice({ diceId, criteria: { transform: newTransform } })
      await touchDice({ diceId })
    };

    diceEl.addEventListener("mousemove", onMove, false);
    diceEl.addEventListener("mouseup", onMouseUp, false);
    diceEl.addEventListener("mouseleave", onMouseUp, false);

    return false;
  }
</script>

{#if isRender}
  <g id={shadow ? `shadow_dice_${diceId}` : `dice_${diceId}`}
     style={diceStyleStr}
     class="token-transition"
     on:mousedown={(e)=>onMouseDown(e)}>
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
              color={diceColor}
              diceSize={DICE_SIZE}
          ></Aster>
        {:else }
          <Die
              dice={face}
              color={diceColor}
              diceSize={DICE_SIZE}
          ></Die>
        {/if}
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