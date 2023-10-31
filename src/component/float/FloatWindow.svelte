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

  const {setFloats, floats} =useFloats()
  export let float = {} as Float;

  let xt = 0
  let yt = 0
  let wt = 0
  let ht = 0

  $: floatStyle = (()=>{
    const { x = 0, y = 0, w = 0, h = 0 } = float;
    const styleObject = {
      position: "absolute",
      left: `${xt ?? x}px`,
      top: `${yt ?? y}px`,
      width: `${wt ?? w}px`,
      height: `${ht ?? h}px`,
      border: "1px solid dimgray",
      backgroundColor: "transparent",
    };
    return toCSS(styleObject)
  })();
  $: top = true;
  $: dragMove = false;
  $: scaleNw = false;
  $: scaleSe = false;
  $: scaleSw = false;




  const onHandleMouseDown = (e: MouseEvent) => {
    e.stopPropagation();
    const { x: x0, y: y0 } = float;

    /* copy origin to transition */
    xt = x0;
    yt = y0;

    const downX = e.clientX;
    const downY = e.clientY;

    const el = document.getElementById(`move_handle_${float.id}`);
    if (!el) throw new Error(`no node with move_handle_${float.id}`)

    const onHandleMouseMove = (e: MouseEvent) => {
      e.stopPropagation();
      const dx = e.clientX - downX;
      const dy = e.clientY - downY;
      const x = Math.max(0, x0 + dx);
      const y = Math.max(0, y0 + dy);
      xt = x;
      yt = y;
      // console.log(`xt: ${xt}, yt: ${yt}`);
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
      }
      setFloats($floats);

      el.removeEventListener("mousemove", onHandleMouseMove);
      el.removeEventListener("mouseup", onHandleMouseUp);
      el.removeEventListener("mouseleave", onHandleMouseUp);
    };

    el.addEventListener("mousemove", onHandleMouseMove, false);
    el.addEventListener("mouseup", onHandleMouseUp, false);
    el.addEventListener("mouseleave", onHandleMouseUp, false);

  }
  const onClickClose = () => {
  }
  const onScaleMouseDown = (e: MouseEvent, direction: string) => {
    console.log("FloatWindow.onScaleMouseDown", e, direction);
  }
  const onClickShroud = () => {
  }


</script>

{#if float.show}
  <div style={floatStyle} class="float bs-5">
    <!-- move -->
    <div
        id={`move_handle_${float.id}`}
        class={`move-handle z-10 ${top ? 'top' : ''}`}
        on:mousedown={onHandleMouseDown}
    >
      <span class="float-handle__title">{float.contentTitle }</span>
      {#if dragMove}
        <div class="move-hit-box"></div>
      {/if}

      {#if !dragMove}
        <button
            on:mousedown={(e)=>e.stopPropagation}
            on:click={onClickClose}
            style="float: right"
        >
          閉じる
        </button>
      {/if}
      <!--      <float-duplicator v-if="!dragMove" :float-id="floatId"/>-->
      <!--      <hint-container v-if="!dragMove" :float-id="floatId"/>-->
    </div>
    <!-- scale diagonal -->
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
    {#if !top}
      <div on:click={onClickShroud} class="float-content__shroud"></div>
    {/if}
    <div class="content-slot z-1">
      <slot name="content">failed to load content: { float.id }</slot>
    </div>
  </div>
{/if}


<style lang="scss">
  $handle-height: 2rem;
  $control-size: 15px;
  $edge: 3px solid steelblue;
  $ww: 200vw;
  $hh: 200vh;

  div.float-content__shroud {
    z-index: 1;
    background: radial-gradient(
                    circle at center,
                    rgba(0, 0, 0, 0) 0,
                    rgba(0, 0, 0, 0.05) 80%,
                    rgba(0, 0, 0, 0.1) 100%
    );
    position: absolute;
    top: 2rem;
    left: 0;
    width: 100%;
    height: calc(100% - 2rem);
  }

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

    &.top {
      background-color: lightsteelblue;
    }
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
