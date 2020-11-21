<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div :style="floatStyle">
    <!-- scale horizontal / vertical -->
    <div :style="eHandleStyle">e</div>
    <div :style="sHandleStyle">s</div>
    <div :style="wHandleStyle">w</div>
    <div
      :id="`handle_${floatId}`"
      :style="handleStyle"
      @mousedown="onMouseDown($event)"
    >
      handle
      <div v-if="dragged" :style="dragStyle"></div>
    </div>
    <!-- scale diagonal -->
    <div :style="seHandleStyle">se</div>
    <div :style="swHandleStyle">sw</div>
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
      dragged: false
    };
  },
  methods: {
    onMouseDown(e) {
      console.log("FloatGroup.onMouseDown"); // @DELETEME
      e.stopPropagation();
      const { x: x0, y: y0 } = this.float;

      const downX = e.clientX;
      const downY = e.clientY;
      this.dragged = true;

      const $el = document.getElementById(`handle_${this.floatId}`);

      const onMove = e => {
        e.stopPropagation();
        const dx = e.clientX - downX;
        const dy = e.clientY - downY;
        const x = x0 + dx;
        const y = y0 + dy;
        this.$store.dispatch("float/move", { id: this.floatId, x, y });
      };

      const onMouseUp = async e => {
        e.stopPropagation();
        this.dragged = false;
        $el.removeEventListener("mousemove", onMove);
        $el.removeEventListener("mouseup", onMouseUp);
        $el.removeEventListener("mouseleave", onMouseUp);
      };

      $el.addEventListener("mousemove", onMove, false);
      $el.addEventListener("mouseup", onMouseUp, false);
      $el.addEventListener("mouseleave", onMouseUp, false);

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
        backgroundColor: "lightgray"
      };
    },
    dragStyle() {
      const { w = 0, h = 0 } = this.float;
      const a = 1000;
      return {
        border: "1px red dashed",
        backgroundColor: "salmon",
        width: `${a + w}px`,
        height: `${a + h}px`,
        position: "absolute",
        left: `${-a / 2}px`,
        top: `${-a / 2}px`
      };
    },
    seHandleStyle() {
      return {
        backgroundColor: "red",
        width: "10px",
        height: "10px",
        position: "absolute",
        bottom: 0,
        right: 0
      };
    },
    swHandleStyle() {
      return {
        backgroundColor: "red",
        width: "10px",
        height: "10px",
        position: "absolute",
        bottom: 0,
        left: 0
      };
    },
    eHandleStyle() {
      return {
        backgroundColor: "blue",
        width: "10px",
        height: "100%",
        position: "absolute",
        top: 0,
        right: 0
      };
    },
    sHandleStyle() {
      return {
        backgroundColor: "blue",
        width: "100%",
        height: "10px",
        position: "absolute",
        bottom: 0,
        left: 0
      };
    },
    wHandleStyle() {
      return {
        backgroundColor: "blue",
        width: "10px",
        height: "100%",
        position: "absolute",
        bottom: 0,
        left: 0
      };
    }
  }
};
</script>

<style scoped></style>
