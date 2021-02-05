<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width:100%; height: 100%;">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="svg-table"
      :style="{
        backgroundColor: 'ghostwhite',
        width: '100%',
        height: '100%'
      }"
      @mousedown="onMouseDown($event)"
      @wheel="onWheel($event)"
    >
      <g
        :id="`board_${activeBoard.id}`"
        v-if="activeBoard"
        :style="{ transform: `${transform}` }"
      >
        <text x="0" y="-3" style="fill: black;">O</text>
        <path
          :d="crossHair"
          style="fill: none;stroke: dimgray; stroke-width: 1px;"
        />
        <svg-map v-for="m in maps" :key="m.id" :map-id="m.id"></svg-map>
        <svg-pawn
          shadow
          v-for="p in pawns"
          :key="`shadow_${p.id}`"
          :pawn-id="p.id"
        ></svg-pawn>
        <svg-pawn v-for="p in pawns" :key="p.id" :pawn-id="p.id"></svg-pawn>
      </g>
    </svg>
  </div>
</template>

<script>
import SvgMap from "@/components/organisms/Svg/SvgMap";
import SvgPawn from "@/components/organisms/Svg/SvgPawn";
import { isMacOS } from "@/scripts/helper";

export default {
  name: "SvgBoard",
  components: { SvgPawn, SvgMap },
  methods: {
    onWheel(event) {
      const SVG_MARGIN = 40;
      const { clientX: _x, clientY: _y } = event;
      const x = _x - SVG_MARGIN;
      const y = _y - SVG_MARGIN;

      /* windowsの場合の正。osxは逆 */
      const dir = (event.deltaY > 0 ? 1 : -1) * (isMacOS() ? -1 : 1);
      const t = new DOMMatrix(this.transform);
      let { a, e: _e, f: _f } = t;

      /* osxの場合はtrackpadとして扱う
       * 慣性スクロールでwheelがマウスの場合より多く発生するので、
       * 係数で抑え込む */
      const MOUSE_SCROLL_SPEED = 1.0;
      const TRACKPAD_SCROLL_SPEED = 0.2;
      const os = isMacOS() ? TRACKPAD_SCROLL_SPEED : MOUSE_SCROLL_SPEED;

      /* Windowsのマウスでwheelが1回発火したときの拡大率のステップ */
      const ZOOM_RATE_DELTA = 0.1;
      const DELTA = a * ZOOM_RATE_DELTA * os;

      /* 拡大率の下限値と上限値 */
      const MIN_ZOOM_RATE = 0.1;
      const MAX_ZOOM_RATE = 3.0;

      /* 倍率100%の際の、boardの原点から測ったクリック位置 */
      const ix = (x - _e) / a;
      const iy = (y - _f) / a;

      /* 倍率を増減 */
      a += dir * DELTA;
      a = Math.max(a, MIN_ZOOM_RATE);
      a = Math.min(a, MAX_ZOOM_RATE);

      /* クリック位置から逆算 */
      const e = x + -a * ix;
      const f = y + -a * iy;

      this.transform = new DOMMatrix([a, 0, 0, a, e, f]);
    },
    async onMouseDown(e) {
      console.log("SvgBoard.onMouseDown"); // @DELETEME
      if (!this.activeBoard) {
        return false;
      }

      e.stopPropagation();

      await this.$store.dispatch("board/dragStart", {
        boardId: this.activeBoard.id
      });

      const $el = document.getElementById("svg-table");
      $el.classList.add("drag");

      const downX = e.clientX;
      const downY = e.clientY;

      /* boardの座標系をglobalへ変換する行列 */
      const $ = document.getElementById(`board_${this.activeBoard.id}`);
      const $$ = $.getCTM();

      function globalToLocal(dx, dy, ctm = new DOMMatrix()) {
        /* 変位をglobalからDOMローカルの座標系へ変換 */
        return new DOMMatrix([1, 0, 0, 1, dx, dy]).multiply(ctm);
      }

      const onMove = e => {
        e.stopPropagation();
        const t = globalToLocal(e.clientX - downX, e.clientY - downY, $$);
        $.style.transform = `${t}`;
      };

      const onMouseUp = async e => {
        e.stopPropagation();
        console.log("SvgBoard.onMouseUp"); // @DELETEME
        const t = globalToLocal(e.clientX - downX, e.clientY - downY, $$);

        this.transform = `${t}`;
        $el.classList.remove("drag");
        await this.$store.dispatch("board/dragFinish");
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
    activeBoard() {
      return this.$store.getters["board/active"];
    },
    maps() {
      const activeBoardId = this.activeBoard?.id;
      if (!activeBoardId) {
        return [];
      }
      return this.$store.getters["map/info"].filter(
        m => m.board === activeBoardId
      );
    },
    pawns() {
      const activeBoardId = this.activeBoard?.id;
      if (!activeBoardId) {
        return [];
      }
      /* store.pawn/info はupdatedAtの降順
       * HTMLの兄弟要素の重ね順は後勝ちなので、
       * filterで新しい配列を作った後にreverse()する */
      return this.$store.getters["pawn/info"]
        .filter(p => p.board === activeBoardId)
        .reverse();
    },
    crossHair() {
      const g = 10;
      const l = 200;
      const m = 50;
      return `
      M ${l},0
      L 0,0
      L 0,${l}
      M 0,${-m}
      L 0,${-g}
      M ${-m},0
      L ${-g}, 0`;
    }
  },
  data() {
    const zoom = 100;
    const z = zoom / 100;
    const m = new DOMMatrix([z, 0, 0, z, 0, 0]).inverse();
    const defaultTransform = `${m}`;
    return {
      debug: false,
      transform: defaultTransform
    };
  }
};
</script>

<style scoped></style>
