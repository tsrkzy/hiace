<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { Float } from "../../model/Float";
  import { toCSS } from "../../util/style";
  import { useFloats } from "../../model/store/floats";
  import { closeFloat, popFloat } from "../../model/service/FloatService";

  const {
    floats,
    setFloats,
  } = useFloats()
  export let float = {} as Float;

  /* transition: 移動・サイズ変更中の値 */
  let xt = float.x
  let yt = float.y
  let wt = float.w
  let ht = float.h

  /* ドラッグ操作中 */
  let isDragMove = false;

  /* ドラッグ中のハンドルの方向 */
  let scaleNe = false;
  let scaleNw = false;
  let scaleSe = false;
  let scaleSw = false;

  $: floatStyle = (() => {
    const { x = 0, y = 0, w = 0, h = 0 } = float;
    const styleObject = {
      position: "absolute",
      left: `${xt ?? x}px`,
      top: `${yt ?? y}px`,
      width: `${wt ?? w}px`,
      height: `${ht ?? h}px`,
      border: "1px solid dimgray",
      backgroundColor: "transparent",
      zIndex: `${float.z}`
    };
    return toCSS(styleObject)
  })();

  const onClickBackground = (e: MouseEvent) => {
    console.log("FloatWindow.onClickBackground");
    e.stopPropagation();
    popFloat(float.id)
  }

  const onHandleMouseDown = (e: MouseEvent) => {
    console.log("FloatWindow.onHandleMouseDown");
    e.stopPropagation();
    popFloat(float.id)

    const { x: x0, y: y0 } = float;

    /* マウス移動中の座標で再描画するため、transition系の座標をfloatの現在座標で初期化 */
    xt = x0;
    yt = y0;

    const downX = e.clientX;
    const downY = e.clientY;
    isDragMove = true;

    const el = document.getElementById(`move_handle_${float.id}`);
    if (!el) {
      throw new Error(`no node with move_handle_${float.id}`)
    }

    const onHandleMouseMove = (e: MouseEvent) => {
      e.stopPropagation();
      const dx = e.clientX - downX;
      const dy = e.clientY - downY;

      /* ブラウザウィンドウの左側および上側の画面外に行かないように */
      const x = Math.max(0, x0 + dx);
      const y = Math.max(0, y0 + dy);
      /* ブラウザウィンドウの右側および下側の画面外に行かないように @TODO */

      xt = x;
      yt = y;
    };


    const onHandleMouseUp = async (e: MouseEvent) => {
      e.stopPropagation();

      for (let i = 0; i < $floats.length; i++) {
        const f = $floats[i];
        if (f.id !== float.id) {
          continue;
        }
        f.x = xt;
        f.y = yt;

        isDragMove = false;
      }
      /* svelte-storeを発火させる */
      setFloats($floats);

      el.removeEventListener("mousemove", onHandleMouseMove);
      el.removeEventListener("mouseup", onHandleMouseUp);
      el.removeEventListener("mouseleave", onHandleMouseUp);
    };

    el.addEventListener("mousemove", onHandleMouseMove, false);
    el.addEventListener("mouseup", onHandleMouseUp, false);
    el.addEventListener("mouseleave", onHandleMouseUp, false);

  }

  const onClickClose = (e: MouseEvent, floatId: number) => {
    console.log("FloatWindow.onClickClose");
    e.stopPropagation();
    closeFloat(floatId);
  }

  const onScaleMouseDown = (e: MouseEvent, direction: string) => {
    console.log("FloatWindow.onScaleMouseDown", e, direction);
    e.stopPropagation();
    popFloat(float.id);

    const isNe = direction === "ne";
    const isNw = direction === "nw";
    const isSw = direction === "sw";
    const isSe = direction === "se";
    const isN = isNw || isNe;
    const isE = isSe || isNe;

    const { x: x0, y: y0, w: w0, h: h0 } = float;

    /* マウス移動中の座標で再描画するため、transition系の座標をfloatの現在座標で初期化 */
    xt = x0;
    yt = y0;
    wt = w0;
    ht = h0;

    const downX = e.clientX;
    const downY = e.clientY;
    scaleNe = isNe;
    scaleNw = isNw;
    scaleSw = isSw;
    scaleSe = isSe;

    const el = document.getElementById(
      `scale_${direction}_handle_${float.id}`
    );
    if (!el) {
      throw new Error(`cannot found node: scale_${direction}_handle_${float.id}`)
    }

    const onHandleMouseMove = (e: MouseEvent) => {
      e.stopPropagation();
      const dx = e.clientX - downX;
      const dy = e.clientY - downY;
      /* 最小幅または最小高さを下回る場合は、最小幅または最小高さをセット */
      const _w = isE ? w0 + dx : w0 - dx;
      const _h = isN ? h0 - dy : h0 + dy;

      const tooSmallW = _w < 300;
      const tooSmallH = _h < 200;

      /* swの場合はxとwを変更、seの場合はwのみ */
      const _x = isE ? x0 : x0 + dx;
      const _y = isN ? y0 + dy : y0;

      const w = tooSmallW ? 300 : _w;
      const h = tooSmallH ? 200 : _h;

      const x = Math.max(0, tooSmallW ? x0 : _x);
      const y = Math.max(0, tooSmallH ? y0 : _y);

      xt = x;
      yt = y;
      wt = w;
      ht = h;
    };

    const onHandleMouseUp = async (e: MouseEvent) => {
      console.log("Float.onHandleMouseUp");
      e.stopPropagation();

      xt = float.x = xt;
      yt = float.y = yt;
      wt = float.w = wt;
      ht = float.h = ht;

      scaleNe = false;
      scaleNw = false;
      scaleSw = false;
      scaleSe = false;

      el.removeEventListener("mousemove", onHandleMouseMove);
      el.removeEventListener("mouseup", onHandleMouseUp);
      el.removeEventListener("mouseleave", onHandleMouseUp);
    };

    el.addEventListener("mousemove", onHandleMouseMove, false);
    el.addEventListener("mouseup", onHandleMouseUp, false);
    el.addEventListener("mouseleave", onHandleMouseUp, false);

    return false;
  }

</script>

{#if float.show}
  <div style={floatStyle} class="float bs-5" on:click={(e)=>onClickBackground(e)}>
    <!-- move -->
    <div
        id={`move_handle_${float.id}`}
        class={"move-handle z-10"}
        on:mousedown={onHandleMouseDown}
    >
      <span class="float-handle__title">{float.contentTitle }</span>
      {#if isDragMove}
        <div class="move-hit-box"></div>
      {/if}

      <button
          on:mousedown={e=>e.stopPropagation()}
          on:click={(e)=>onClickClose(e, float.id)}
          style="float: right;margin-right: .5rem;"
      >
        閉じる
      </button>
      <!--      <float-duplicator v-if="!isDragMove" :float-id="floatId"/>-->
      <!--      <hint-container v-if="!isDragMove" :float-id="floatId"/>-->
    </div>
    <!-- scale diagonal -->
    {#if !isDragMove}
      <div
          id={`scale_ne_handle_${float.id}`}
          class="scale-handle__ne z-10"
          on:mousedown={(e)=>onScaleMouseDown(e, 'ne')}
      >
        {#if scaleNe}
          <div class="scale-hit-box__ne"></div>
        {/if}
      </div>
      <div
          id={`scale_nw_handle_${float.id}`}
          class="scale-handle__nw z-10"
          on:mousedown={(e)=>onScaleMouseDown(e, 'nw')}
      >
        {#if scaleNw}
          <div class="scale-hit-box__nw"></div>
        {/if}
      </div>
      <div
          id={`scale_se_handle_${float.id}`}
          class="scale-handle__se z-10"
          on:mousedown={(e)=>onScaleMouseDown(e, 'se')}
      >
        {#if scaleSe}
          <div class="scale-hit-box__se"></div>
        {/if}
      </div>
      <div
          id={`scale_sw_handle_${float.id}`}
          class="scale-handle__sw z-10"
          on:mousedown={(e)=>onScaleMouseDown(e, 'sw')}
      >
        {#if scaleSw}
          <div class="scale-hit-box__sw"></div>
        {/if}
      </div>
    {/if}
    <div class="content-slot z-1">
      <slot></slot>
    </div>
  </div>
{/if}


<style lang="scss">
  $handle-height: 2rem;
  $control-size: 15px;
  $edge: 3px solid steelblue;
  $ww: 200vw;
  $hh: 200vh;

  //button.button__close {
  //  top: 0;
  //  right: 0;
  //  position: absolute;
  //  border: none;
  //  height: $handle-height;
  //}

  .move-handle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: $handle-height;
    background-color: lightgray;
    cursor: move;

  }

  .move-hit-box {
    background-color: transparent;
    width: $ww;
    height: $hh;
    position: absolute;
    left: calc(-1 * #{$ww} / 2);
    top: calc(-1 * #{$hh} / 2);
    cursor: move;
  }

  .scale-hit-box__ne,
  .scale-hit-box__nw,
  .scale-hit-box__se,
  .scale-hit-box__sw {
    background-color: transparent;
    width: $ww;
    height: $hh;
    position: absolute;
    left: calc(-1 * #{$ww} / 2);
    top: calc(-1 * #{$hh} / 2);
    cursor: grabbing;
  }

  .scale-handle__ne {
    width: $control-size;
    height: $control-size;
    position: absolute;
    top: 0;
    right: 0;
    cursor: nesw-resize;

    &:hover {
      border-top: $edge;
      border-right: $edge;
    }
  }

  .scale-handle__nw {
    width: $control-size;
    height: $control-size;
    position: absolute;
    top: 0;
    left: 0;
    cursor: nwse-resize;

    &:hover {
      border-top: $edge;
      border-left: $edge;
    }
  }

  .scale-handle__se {
    width: $control-size;
    height: $control-size;
    position: absolute;
    bottom: 0;
    right: 0;
    cursor: nwse-resize;

    &:hover {
      border-bottom: $edge;
      border-right: $edge;
    }
  }

  .scale-handle__sw {
    width: $control-size;
    height: $control-size;
    position: absolute;
    bottom: 0;
    left: 0;
    cursor: nesw-resize;

    &:hover {
      border-bottom: $edge;
      border-left: $edge;
    }
  }

  .content-slot {
    width: 100%;
    height: calc(100% - 2em);
    background-color: ghostwhite;
    margin-top: 2em;
  }
</style>
