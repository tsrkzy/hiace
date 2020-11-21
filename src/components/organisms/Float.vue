<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div :style="floatStyle">
    <div
      :id="`move_handle_${floatId}`"
      class="move-handle"
      @mousedown="onHandleMouseDown($event)"
    >
      handle
      <div v-if="dragMove" class="move-hit-box"></div>
    </div>
    <!-- scale diagonal -->
    <div
      :id="`scale_se_handle_${floatId}`"
      class="scale-handle__se"
      @mousedown="onScaleMouseDown($event, 'se')"
    >
      <div v-if="scaleSe" class="scale-hit-box__se"></div>
    </div>
    <div
      :id="`scale_sw_handle_${floatId}`"
      class="scale-handle__sw"
      @mousedown="onScaleMouseDown($event, 'sw')"
    >
      <div v-if="scaleSw" class="scale-hit-box__sw"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Float",
  props: {
    floatId: { type: Number, require: true }
  },
  data() {
    return {
      dragMove: false,
      scaleSe: false,
      scaleSw: false,
      xt: null,
      yt: null,
      wt: null,
      ht: null
    };
  },
  methods: {
    async onHandleMouseDown(e) {
      console.log("FloatGroup.onHandleMouseDown"); // @DELETEME
      e.stopPropagation();
      await this.$store.dispatch("float/pop", { id: this.floatId });
      const { x: x0, y: y0 } = this.float;

      const downX = e.clientX;
      const downY = e.clientY;
      this.dragMove = true;

      const $el = document.getElementById(`move_handle_${this.floatId}`);

      const onHandleMouseMove = e => {
        e.stopPropagation();
        const dx = e.clientX - downX;
        const dy = e.clientY - downY;
        const x = Math.max(0, x0 + dx);
        const y = Math.max(0, y0 + dy);
        this.xt = x;
        this.yt = y;
      };

      const onHandleMouseUp = async e => {
        e.stopPropagation();
        await this.$store.dispatch("float/move", {
          id: this.floatId,
          x: this.xt,
          y: this.yt
        });
        this.xt = null;
        this.yt = null;

        this.dragMove = false;
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
      const isSw = direction === "sw";
      const isSe = direction === "se";

      e.stopPropagation();
      await this.$store.dispatch("float/pop", { id: this.floatId });
      const { x: x0, y: y0, w: w0, h: h0 } = this.float;

      const downX = e.clientX;
      const downY = e.clientY;
      this.scaleSw = isSw;
      this.scaleSe = isSe;

      const $el = document.getElementById(
        `scale_${direction}_handle_${this.floatId}`
      );

      const onHandleMouseMove = e => {
        e.stopPropagation();
        const dx = e.clientX - downX;
        const dy = e.clientY - downY;
        /* 最小幅または最小高さを下回る場合は、最小幅または最小高さをセット */
        const _w = isSe ? w0 + dx : w0 - dx;
        const _h = h0 + dy;

        const tooSmallW = _w < 200;
        const tooSmallH = _h < 100;

        /* swの場合はxとwを変更、seの場合はwのみ */
        const _x = isSe ? x0 : x0 + dx;
        const _y = y0;

        const w = tooSmallW ? 200 : _w;
        const h = tooSmallH ? 100 : _h;

        const x = Math.max(0, tooSmallW ? x0 : _x);
        const y = Math.max(0, tooSmallH ? y0 : _y);

        this.xt = x;
        this.yt = y;
        this.wt = w;
        this.ht = h;
      };

      const onHandleMouseUp = async e => {
        console.log("Float.onHandleMouseUp"); // @DELETEME
        e.stopPropagation();

        this.$store.dispatch("float/scale", {
          id: this.floatId,
          w: this.wt,
          h: this.ht
        });
        this.$store.dispatch("float/move", {
          id: this.floatId,
          x: this.xt,
          y: this.yt
        });
        this.xt = null;
        this.yt = null;
        this.wt = null;
        this.ht = null;
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
    }
  },
  computed: {
    float() {
      return this.$store.getters["float/info"].find(f => f.id === this.floatId);
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
        backgroundColor: "ghostwhite"
      };
    }
  }
};
</script>

<style lang="scss" scoped>
$ww: 200vw;
$hh: 200vh;

.move-handle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2em;
  background-color: lightgray;
  cursor: move;
}
.move-hit-box {
  border: 1px red dashed;
  background-color: transparent;
  width: $ww;
  height: $hh;
  position: absolute;
  left: calc(-1 * #{$ww} / 2);
  top: calc(-1 * #{$hh} / 2);
  cursor: move;
}
.scale-hit-box__se,
.scale-hit-box__sw {
  border: 1px red dashed;
  background-color: transparent;
  width: $ww;
  height: $hh;
  position: absolute;
  left: calc(-1 * #{$ww} / 2);
  top: calc(-1 * #{$hh} / 2);
  cursor: grabbing;
}
.scale-handle__se {
  background-color: red;
  width: 10px;
  height: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
  cursor: nwse-resize;
}
.scale-handle__sw {
  background-color: red;
  width: 10px;
  height: 10px;
  position: absolute;
  bottom: 0;
  left: 0;
  cursor: nesw-resize;
}
</style>
