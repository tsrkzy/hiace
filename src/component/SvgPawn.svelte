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
  import { useBoards } from "../model/store/boards";
  import { touchPawn, updatePawnTransfer } from "../model/service/PawnService";

  export let pawnId: string = "";
  export let shadow: boolean = false;

  const { pawns } = usePawns()
  const { imageSources } = useImageSources()
  const { characters } = useCharacters()
  const { activeBoard } = useBoards()

  let archived = false;
  let shadowHandler = true;
  let dragged = false;

  $: pawn = (() => {
    return $pawns.find(pawn => pawn.id === pawnId)
  })();

  $: character = (() => {
    return $characters.find(character => character.id === pawn?.character)
  })()

  $: imageSource = (() => {
    return $imageSources.find(imageSource => imageSource.id === character?.image)
  })()


  $: pawnSize = (() => {
    const PAWN_UNIT_SIZE = 120;
    return (character?.pawnSize ?? 1) * PAWN_UNIT_SIZE;
  })()

  let transform = pawn?.transform || new DOMMatrix();
  $: pawnStyleString = toCSS({ transform: `${transform}` });
  $: filter = shadow ? `url(#shadow_filter_${pawnId})` : ''


  const DEFAULT_PAWN_IMAGE_URL = "../assets/images/default_pawn.png";

  const onMouseDown = (e: MouseEvent) => {
    console.log("SvgPawn.onMouseDown", e);
    e.stopPropagation();
    e.preventDefault();


    const downX = e.clientX;
    const downY = e.clientY;

    const pawnEl = document.getElementById(`pawn_${pawnId}`) as HTMLElement&SVGGElement;
    const boardEl = document.getElementById(`board_${$activeBoard?.id}`) as HTMLElement&SVGGElement;
    // 要素が取得できなければログだけして終了
    if (!pawnEl || !boardEl) {
      console.log("SvgPawn.onMouseDown: pawnEl or boardEl is null");
      return;
    }

    pawnEl.classList.remove("token-transition");

    /* globalの座標系をboard,pawnの座標系へ変換する行列 */
    const ctmB = boardEl.getCTM(); // global -> board
    const ctmP = pawnEl.getCTM(); // global -> pawn
    const ctmBp = ctmB.inverse().multiply(ctmP); // board -> pawn

    function globalToLocal(dx, dy) {
      /* 変位をglobalからDOMローカルの座標系へ変換 */
      return new DOMMatrix([1, 0, 0, 1, dx / ctmP.a, dy / ctmP.a]).translate(
        ctmBp.e,
        ctmBp.f
      );
    }

    const onMove = (e) => {
      e.stopPropagation();
      transform = `${globalToLocal(e.clientX - downX, e.clientY - downY)}`;
    };

    const onMouseUp = async (e) => {
      e.stopPropagation();
      console.log("SvgPawn.onMouseUp"); // @DELETEME

      pawnEl.classList.add("token-transition");

      pawnEl.removeEventListener("mousemove", onMove);
      pawnEl.removeEventListener("mouseup", onMouseUp);
      pawnEl.removeEventListener("mouseleave", onMouseUp);

      transform = globalToLocal(e.clientX - downX, e.clientY - downY);

      await touchPawn({ pawnId })
      await updatePawnTransfer({ pawnId, transform })
      // touch("コマ", "character", this.pawn.character); // @TODO
    };

    pawnEl.addEventListener("mousemove", onMove, false);
    pawnEl.addEventListener("mouseup", onMouseUp, false);
    pawnEl.addEventListener("mouseleave", onMouseUp, false);


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
    >{ character?.name || "name" } #{ pawnId.slice(0, 3) }</text
    >
    <text x="0" y="12" fill="white">{ character?.name || "name" }</text>
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