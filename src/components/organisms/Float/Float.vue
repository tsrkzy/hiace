<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div v-if="float.show" :style="floatStyle" class="float bs-5">
    <!-- move -->
    <div
      :id="`move_handle_${floatId}`"
      :class="`move-handle z-10 ${top ? 'top' : ''}`"
      @mousedown="onHandleMouseDown($event)"
    >
      <span class="float-handle__title">{{ float.contentTitle }}</span>
      <div v-if="dragMove" class="move-hit-box"></div>

      <button
        v-if="!dragMove"
        @mousedown.stop
        @click="onClickClose($event)"
        style="float: right"
      >
        閉じる
      </button>
      <float-duplicator v-if="!dragMove" :float-id="floatId" />
      <hint-container v-if="!dragMove" :float-id="floatId" />
    </div>
    <!-- scale diagonal -->
    <div
      :id="`scale_nw_handle_${floatId}`"
      class="scale-handle__nw z-10"
      @mousedown="onScaleMouseDown($event, 'nw')"
    >
      <div v-if="scaleNw" class="scale-hit-box__nw"></div>
    </div>
    <div
      :id="`scale_se_handle_${floatId}`"
      class="scale-handle__se z-10"
      @mousedown="onScaleMouseDown($event, 'se')"
    >
      <div v-if="scaleSe" class="scale-hit-box__se"></div>
    </div>
    <div
      :id="`scale_sw_handle_${floatId}`"
      class="scale-handle__sw z-10"
      @mousedown="onScaleMouseDown($event, 'sw')"
    >
      <div v-if="scaleSw" class="scale-hit-box__sw"></div>
    </div>
    <div v-if="!top" @click="onClickShroud" class="float-content__shroud"></div>
    <div class="content-slot z-1">
      <slot name="content">failed to load content: {{ floatId }}</slot>
    </div>
  </div>
</template>

<script>
import FloatDuplicator from "@/components/organisms/Float/FloatDuplicator";
import HintContainer from "@/components/organisms/Float/HintContainer";

export default {
  name: "Float",
  components: { FloatDuplicator, HintContainer },
  props: {
    floatId: { type: Number, require: true },
  },
  data() {
    return {
      dragMove: false,
      scaleNw: false,
      scaleSe: false,
      scaleSw: false,

      /* originの座標はstoreで管理する。
       * transition -- インタラクション中の座標はコンポーネントで保持し、originより優先して読み込む */
      xt: null,
      yt: null,
      wt: null,
      ht: null,
    };
  },
  methods: {
    async onClickShroud() {
      await this.$store.dispatch("float/pop", { id: this.floatId });
    },
    async onClickClose(e) {
      e.stopPropagation();
      await this.$store.dispatch("float/close", { id: this.floatId });
    },
    async onHandleMouseDown(e) {
      console.log("FloatGroup.onHandleMouseDown"); // @DELETEME
      e.stopPropagation();
      await this.$store.dispatch("float/pop", { id: this.floatId });
      const { x: x0, y: y0 } = this.float;

      /* copy origin to transition */
      this.xt = x0;
      this.yt = y0;

      const downX = e.clientX;
      const downY = e.clientY;
      this.dragMove = true;

      const $elList = document.getElementsByClassName("__hide_on_drag");
      Array.prototype.forEach.call(
        $elList,
        ($e) => ($e.style.display = "none")
      );

      const $el = document.getElementById(`move_handle_${this.floatId}`);

      const onHandleMouseMove = (e) => {
        e.stopPropagation();
        const dx = e.clientX - downX;
        const dy = e.clientY - downY;
        const x = Math.max(0, x0 + dx);
        const y = Math.max(0, y0 + dy);
        this.xt = x;
        this.yt = y;
      };

      const onHandleMouseUp = async (e) => {
        e.stopPropagation();
        await this.$store.dispatch("float/move", {
          id: this.floatId,
          x: this.xt,
          y: this.yt,
        });
        this.xt = null;
        this.yt = null;

        this.dragMove = false;

        const $elList = document.getElementsByClassName("__hide_on_drag");
        Array.prototype.forEach.call($elList, ($e) => ($e.style.display = ""));

        $el.removeEventListener("mousemove", onHandleMouseMove);
        $el.removeEventListener("mouseup", onHandleMouseUp);
        $el.removeEventListener("mouseleave", onHandleMouseUp);
      };

      $el.addEventListener("mousemove", onHandleMouseMove, false);
      $el.addEventListener("mouseup", onHandleMouseUp, false);
      $el.addEventListener("mouseleave", onHandleMouseUp, false);

      return false;
    },
    async onScaleMouseDown(e, direction = "sw") {
      console.log("Float.onScaleMouseDown", direction); // @DELETEME
      const isNw = direction === "nw";
      const isSw = direction === "sw";
      const isSe = direction === "se";
      const isN = isNw;
      const isE = isSe;

      e.stopPropagation();
      await this.$store.dispatch("float/pop", { id: this.floatId });
      const { x: x0, y: y0, w: w0, h: h0 } = this.float;

      /* copy origin to transition */
      this.xt = x0;
      this.yt = y0;
      this.wt = w0;
      this.ht = h0;

      const downX = e.clientX;
      const downY = e.clientY;
      this.scaleNw = isNw;
      this.scaleSw = isSw;
      this.scaleSe = isSe;

      const $el = document.getElementById(
        `scale_${direction}_handle_${this.floatId}`
      );

      const onHandleMouseMove = (e) => {
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

        this.xt = x;
        this.yt = y;
        this.wt = w;
        this.ht = h;
      };

      const onHandleMouseUp = async (e) => {
        console.log("Float.onHandleMouseUp"); // @DELETEME
        e.stopPropagation();

        this.$store.dispatch("float/scale", {
          id: this.floatId,
          w: this.wt,
          h: this.ht,
        });
        this.$store.dispatch("float/move", {
          id: this.floatId,
          x: this.xt,
          y: this.yt,
        });
        this.xt = null;
        this.yt = null;
        this.wt = null;
        this.ht = null;
        this.scaleNw = false;
        this.scaleSw = false;
        this.scaleSe = false;
        $el.removeEventListener("mousemove", onHandleMouseMove);
        $el.removeEventListener("mouseup", onHandleMouseUp);
        $el.removeEventListener("mouseleave", onHandleMouseUp);
      };

      $el.addEventListener("mousemove", onHandleMouseMove, false);
      $el.addEventListener("mouseup", onHandleMouseUp, false);
      $el.addEventListener("mouseleave", onHandleMouseUp, false);

      return false;
    },
  },
  computed: {
    float() {
      return this.$store.getters["float/info"].find(
        (f) => f.id === this.floatId
      );
    },
    top() {
      return this.$store.getters["float/top"]?.id === this.floatId;
    },
    floatStyle() {
      const { xt, yt, wt, ht } = this;
      const { x = 0, y = 0, w = 0, h = 0 } = this.float;
      return {
        position: "absolute",
        left: `${xt ?? x}px`,
        top: `${yt ?? y}px`,
        width: `${wt ?? w}px`,
        height: `${ht ?? h}px`,
        border: "1px solid dimgray",
        backgroundColor: "transparent",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
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

button.button__close {
  top: 0;
  right: 0;
  position: absolute;
  border: none;
  height: $handle-height;
}

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
