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
      :style="handleStyle"
      @mousedown="onHandleMouseDown($event)"
    >
      handle
      <div v-if="dragMove" :style="dragStyle"></div>
    </div>
    <!-- scale diagonal -->
    <div
      :id="`scale_se_handle_${floatId}`"
      :style="seHandleStyle"
      @mousedown="onScaleMouseDown($event, 'se')"
    >
      <div v-if="scaleSe" :style="scaleStyle"></div>
    </div>
    <div
      :id="`scale_sw_handle_${floatId}`"
      :style="swHandleStyle"
      @mousedown="onScaleMouseDown($event, 'sw')"
    >
      <div v-if="scaleSw" :style="scaleStyle"></div>
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
      scaleSw: false
    };
  },
  methods: {
    onHandleMouseDown(e) {
      console.log("FloatGroup.onHandleMouseDown"); // @DELETEME
      e.stopPropagation();
      const { x: x0, y: y0 } = this.float;

      const downX = e.clientX;
      const downY = e.clientY;
      this.dragMove = true;

      const $el = document.getElementById(`move_handle_${this.floatId}`);

      const onHandleMouseMove = e => {
        e.stopPropagation();
        const dx = e.clientX - downX;
        const dy = e.clientY - downY;
        const x = x0 + dx;
        const y = y0 + dy;
        this.$store.dispatch("float/move", { id: this.floatId, x, y });
      };

      const onHandleMouseUp = async e => {
        e.stopPropagation();
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
    onScaleMouseDown(e, direction = "sw") {
      console.log("Float.onScaleMouseDown", direction); // @DELETEME
      const isSw = direction === "sw";
      const isSe = direction === "se";

      e.stopPropagation();
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

        const x = tooSmallW ? x0 : _x;
        const y = tooSmallH ? y0 : _y;

        this.$store.dispatch("float/scale", { id: this.floatId, w, h });
        this.$store.dispatch("float/move", { id: this.floatId, x, y });
      };

      const onHandleMouseUp = async e => {
        console.log("Float.onHandleMouseUp"); // @DELETEME
        e.stopPropagation();
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
      const { x = 0, y = 0, w = 0, h = 0 } = this.float;
      return {
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        width: `${w}px`,
        height: `${h}px`,
        border: "1px solid dimgray",
        backgroundColor: "ghostwhite"
      };
    },
    handleStyle() {
      return {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "2.0em",
        backgroundColor: "lightgray",
        cursor: "move"
      };
    },
    dragStyle() {
      const { w = 0, h = 0 } = this.float;
      const a = 3000;
      return {
        border: "1px red dashed",
        backgroundColor: "transparent",
        width: `${a + w}px`,
        height: `${a + h}px`,
        position: "absolute",
        left: `${-a / 2}px`,
        top: `${-a / 2}px`,
        cursor: "move"
      };
    },
    scaleStyle() {
      const { w = 0, h = 0 } = this.float;
      const a = 3000;
      return {
        border: "1px red dashed",
        backgroundColor: "transparent",
        width: `${a + w}px`,
        height: `${a + h}px`,
        position: "absolute",
        left: `${-a / 2}px`,
        top: `${-a / 2}px`,
        cursor: "grabbing"
      };
    },
    seHandleStyle() {
      return {
        backgroundColor: "red",
        width: "10px",
        height: "10px",
        position: "absolute",
        bottom: 0,
        right: 0,
        cursor: "nwse-resize"
      };
    },
    swHandleStyle() {
      return {
        backgroundColor: "red",
        width: "10px",
        height: "10px",
        position: "absolute",
        bottom: 0,
        left: 0,
        cursor: "nesw-resize"
      };
    }
  }
};
</script>

<style scoped></style>
