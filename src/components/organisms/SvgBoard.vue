<template>
  <div style="width:100%; height: 100%;">
    <div
      style="position:fixed; top:0; right:0;background-color: lightgray; opacity: 0.2;"
    >
      <!-- debug -->
      <label>
        <span>debug: </span>
        <input type="checkbox" v-model="debug" />
      </label>
      <div v-if="debug">
        <div>
          <ha-button @click="onResetBoard(1)">RESET BOARD x1</ha-button>
          <ha-button @click="onResetBoard(0.5)">RESET BOARD x0.5</ha-button>
          <ha-button @click="onResetBoard(2)">RESET BOARD x2</ha-button>
          <h5>MAPS</h5>
          <div :key="m.id" v-for="m in maps">
            {{ m.id }}, {{ m.offsetX }}, {{ m.offsetY }}
          </div>
          <h5>PAWNS</h5>
          <div :key="p.id" v-for="p in pawns">
            <ha-button @click="onResetPawn(p.id)"
              >RESET PAWN: {{ p.id }}</ha-button
            >
          </div>
        </div>
      </div>
    </div>
    <svg
      id="svg-table"
      :style="{
        backgroundColor: 'ghostwhite',
        width: '100%',
        height: '100%'
      }"
      @mousedown="onMouseDown($event)"
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
        <!-- boardの座標原点 -->
        <!-- <circle r="2" cx="0" cy="0" style="fill: red;stroke: none;"></circle> -->
        <!-- <text>O: {{ transform }} - {{ activeBoard.id }}</text> -->
      </g>
    </svg>
  </div>
</template>

<script>
import { FSPawn } from "@/collections/Pawn";
import HaButton from "@/components/atoms/HaButton";
import SvgMap from "@/components/organisms/SvgMap";
import SvgPawn from "@/components/organisms/SvgPawn";

export default {
  name: "SvgBoard",
  components: { HaButton, SvgPawn, SvgMap },
  methods: {
    onResetBoard(z) {
      this.transform = `matrix(${z}, 0, 0, ${z}, 0, 0)`;
    },
    async onResetPawn(pawnId) {
      await FSPawn.ResetTransform([pawnId]);
    },
    onMouseDown(e) {
      if (!this.activeBoard) {
        return false;
      }

      e.stopPropagation();

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

        this.transform = `${t}`;
      };

      const onMouseUp = e => {
        e.stopPropagation();
        console.log("SvgBoard.onMouseUp"); // @DELETEME
        const t = globalToLocal(e.clientX - downX, e.clientY - downY, $$);

        this.transform = `${t}`;
        $el.classList.remove("drag");
        $el.removeEventListener("mousemove", onMove);
        $el.removeEventListener("mouseup", onMouseUp);
        $el.removeEventListener("mouseleave", onMouseUp);
      };

      $el.addEventListener("mousemove", onMove, false);
      $el.addEventListener("mouseup", onMouseUp, false);
      $el.addEventListener("mouseleave", onMouseUp, false);
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
    svgSize() {
      const $el = document.getElementById("svg-table");
      if (!$el) {
        return { width: 0, height: 0 };
      }
      const { width, height } = $el.getBoundingClientRect();
      return { width, height };
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
    // const zoom = [50, 100, 200][Math.floor(Math.random() * 3)];
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
