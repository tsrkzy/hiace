<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { toCSS } from "../util/style";
  import { usePawns } from "../model/store/pawns";
  import { useImageSources } from "../model/store/imageSources";
  import { useCharacters } from "../model/store/characters";

  export const pawnId:string = "";
  export const shadow:boolean = false;

  const { pawns } = usePawns()
  const { imageSources } = useImageSources()
  const { characters } = useCharacters()

  let archived = false;
  let shadowHandler = true;
  let dragged = false;

  $: pawn = (() => {
    return $pawns.find(pawn => pawn.id === pawnId)
  })();

  $: imageSource = (() => {
    return $imageSources.find(imageSource => imageSource.id === pawn?.image)
  })()

  $: character = (() => {
    return $characters.find(character => character.id === pawn?.character)
  })()

  $: pawnSize = (() => {
    const PAWN_UNIT_SIZE = 120;
    return (character?.pawnSize ?? 1) * PAWN_UNIT_SIZE;
  })()

  let tranform = pawn?.transform || new DOMMatrix();
  $: pawnStyleString = toCSS({ transform: `${tranform}` });
  $: filter = shadow ? `url(#shadow_filter_${pawnId})` : ''


  const DEFAULT_PAWN_IMAGE_URL = "../assets/images/default_pawn.png";

  const onMouseDown = (e: MouseEvent) => {
    console.log("SvgPawn.onMouseDown", e);
  }
  const onMouseEnter = (e: MouseEvent) => {
    console.log("SvgPawn.onMouseEnter", e);
  }

</script>

{#if !archived && shadowHandler}
  <g
      id={shadow ? `shadow_pawn_${pawnId}` : `pawn_${pawnId}`}
      style={pawnStyleString}
      class="token-transition"
      on:mousedown={(e)=>onMouseDown(e)}
      on:mouseenter={(e)=>onMouseEnter(e)}
      filter={filter}
  >
    <filter id={`shadow_filter_${pawnId}`}>
      <feColorMatrix in="SourceGraphic" type="saturate" values="0.1"/>
    </filter>
    <!-- 外枠 -->
    <rect
        width={pawnSize}
        height={pawnSize}
        stroke="black"
        fill="rgba(0,0,0,0.2)"
    ></rect>
    <!-- 画像 -->
    {#if !shadow}
      <image
          preserveAspectRatio="xMidYMid meet"
          width={pawnSize}
          height={pawnSize}
          href={imageSource?.url || DEFAULT_PAWN_IMAGE_URL}
      ></image>
    {/if}
    <!-- ビルボード -->
    <rect
        width={pawnSize}
        height="12"
        stroke="black" fill="black">
    </rect>
    <text x="0" y="12" fill="lightgray"
    >{ character?.name || "character.name" } #{ pawnId.slice(0, 3) }</text
    >
    <text x="0" y="12" fill="white">{ character?.name || "character.name" }</text>
    <!-- ドラッグ中の当たり判定拡張 -->
    {#if dragged}
      <rect
          x={-1000 / 2}
          y={-1000 / 2}
          width={pawnSize + 1000}
          height={pawnSize + 1000}
          stroke="transparent"
          fill="transparent"
      ></rect>
    {/if}
  </g>
{/if}