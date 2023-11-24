<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { touchPawn, updatePawn } from "@/model/service/PawnService";
  import { usePawns } from "@/model/store/pawns";
  import { useImageSources } from "@/model/store/imageSources";
  import { useCharacters } from "@/model/store/characters";
  import { useBoards } from "@/model/store/boards";
  import { useAliases } from "@/model/store/aliases";
  import { toCSS } from "@/util/style";
  import { hideObstaclesToDrag, showObstaclesToDrag } from "@/util/drag";
  import { DEFAULT_PAWN_IMAGE_URL } from "@/constant";
  import { isMacOS } from "@/util/agent";

  export let pawnId: string = "";
  export let shadow: boolean = false;

  const { pawns, draggedPawnId, setDraggedPawnId, setPawnDescriptionSide, setPawnDescriptionText } = usePawns()
  const { imageSources } = useImageSources()
  const { characters } = useCharacters()
  const { aliases } = useAliases()
  const { activeBoard } = useBoards()

  $: pawn = $pawns.find(pawn => pawn.id === pawnId);

  $: character = $characters.find(character => character.id === pawn?.character)

  $: alias =
    $aliases.find(alias =>
      alias.character === character?.id
      && character?.activeAlias === alias.id
    )

  $: imageSource = $imageSources.find(imageSource => imageSource.id === alias?.image)


  $: pawnSize = (() => {
    const PAWN_UNIT_SIZE = 120;
    return (character?.pawnSize ?? 1) * PAWN_UNIT_SIZE;
  })()

  $: pawnStyleString = toCSS({ transform: `${pawn?.transform}` });
  $: filter = shadow ? `url(#shadow_filter_${pawnId})` : ''

  $: dragged = $draggedPawnId === pawnId;

  $: isRender = (() => {
    // 控室の場合はshadow問わず非表示
    if (character?.archived) {
      return false
    }

    if (shadow) {
      // shadowの場合はdrag中のみ表示
      return $draggedPawnId;
    } else {
      // shadowでない場合、ドラッグ中でない場合、あるいはドラッグ中の場合のみ表示
      return !$draggedPawnId || dragged;
    }
  })()

  const onMouseDown = (e: MouseEvent) => {
    console.log("SvgPawn.onMouseDown", e);
    if (!pawn || shadow) {
      return;
    }

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

    setDraggedPawnId(pawnId)
    hideObstaclesToDrag();

    pawnEl.classList.remove("token-transition");

    /* globalの座標系をboard,pawnの座標系へ変換する行列 */
    const ctmB = boardEl.getCTM() as DOMMatrix; // global -> board
    const ctmP = pawnEl.getCTM() as DOMMatrix; // global -> pawn
    const ctmBp = ctmB.inverse().multiply(ctmP); // board -> pawn

    function globalToLocal(dx: number, dy: number) {
      /* 変位をglobalからDOMローカルの座標系へ変換 */
      return new DOMMatrix([1, 0, 0, 1, dx / ctmP.a, dy / ctmP.a]).translate(
        ctmBp.e,
        ctmBp.f
      );
    }

    const onMove = (e: MouseEvent) => {
      if (!pawn) {
        return;
      }

      e.stopPropagation();
      pawn.transform = `${globalToLocal(e.clientX - downX, e.clientY - downY)}`;
    };

    const onMouseUp = async (e: MouseEvent) => {
      if (!pawn) {
        return;
      }

      console.log("SvgPawn.onMouseUp"); // @DELETEME
      e.stopPropagation();

      setDraggedPawnId("")
      showObstaclesToDrag()

      pawnEl.classList.add("token-transition");

      pawnEl.removeEventListener("mousemove", onMove);
      pawnEl.removeEventListener("mouseup", onMouseUp);
      pawnEl.removeEventListener("mouseleave", onMouseUp);

      let newTransform = `${globalToLocal(e.clientX - downX, e.clientY - downY)}`;
      pawn.transform = newTransform;

      await updatePawn({ pawnId, criteria: { transform: newTransform } })
      await touchPawn({ pawnId })
      // touch("コマ", "character", this.pawn.character); // @TODO
    };

    pawnEl.addEventListener("mousemove", onMove, false);
    pawnEl.addEventListener("mouseup", onMouseUp, false);
    pawnEl.addEventListener("mouseleave", onMouseUp, false);
  }

  const onMouseEnter = (e: MouseEvent) => {
    if (!pawn || shadow) {
      return;
    }
    const pawnEl = document.getElementById(`pawn_${pawnId}`) as HTMLElement&SVGGElement;
    if (!pawnEl) {
      console.log("SvgPawn.onMouseEnter: pawnEl is null");
      return;
    }
    const characterText = character?.text || "";
    setPawnDescriptionText(characterText);

    const mouseSide = e.clientX < window.innerWidth / 2 ? "left" : "right";
    setPawnDescriptionSide(mouseSide);

    const onMouseLeave = () => {
      setPawnDescriptionText("");
      pawnEl.removeEventListener("mouseleave", onMouseLeave);
      pawnEl.removeEventListener("wheel", onWheel);
    }

    const onMove = (e: MouseEvent) => {
      e.stopPropagation()
      const mouseSide = e.clientX < window.innerWidth / 2 ? "left" : "right";
      setPawnDescriptionSide(mouseSide);
    }

    const onWheel = (e: WheelEvent) => {
      e.stopPropagation()
      const descriptionEl = document.getElementById("pawn-description") as HTMLElement;
      if (!descriptionEl) {
        console.log("SvgPawn.onWheel: descriptionEl is null");
        return;
      }
      /* osxの場合はtrackpadとして扱う
       * 慣性スクロールでwheelがマウスの場合より多く発生するので、
       * 係数で抑え込む */
      const MOUSE_SCROLL_SPEED = 1.0;
      const TRACKPAD_SCROLL_SPEED = 0.2;
      const deltaY = isMacOS() ? e.deltaY * TRACKPAD_SCROLL_SPEED : e.deltaY * MOUSE_SCROLL_SPEED;
      /* OSXとWindowsはスクロール方向が逆 */
      descriptionEl.scrollTop += isMacOS() ? deltaY : -deltaY
    }
    pawnEl.addEventListener("mouseleave", onMouseLeave, false);
    pawnEl.addEventListener("mousemove", onMove, false);
    pawnEl.addEventListener("wheel", onWheel, false);
  }

</script>

{#if isRender }
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