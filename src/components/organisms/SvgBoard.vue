<template>
  <div>
    <div style="position:fixed; top:0; right:0;">
      <!-- debug -->
      <label>
        <span>debug: </span>
        <input type="checkbox" v-model="debug" />
      </label>
      <div v-if="debug">
        <div>
          <h5>BOARD</h5>
          <div>
            <label>
              <span>Zoom:{{ Zoom }}%</span>
              <input type="range" min="20" max="300" step="10" v-model="Zoom" />
            </label>
          </div>
          <div>
            <label>
              <span>XIntercept:{{ XIntercept }}px</span>
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                v-model="XIntercept"
              />
            </label>
          </div>
          <div>
            <label>
              <span>YIntercept:{{ YIntercept }}px</span>
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                v-model="YIntercept"
              />
            </label>
          </div>
        </div>
        <div>
          <h5>MAPS</h5>
          <div :key="m.id" v-for="m in maps">
            {{ m.id }}, {{ m.offsetX }}, {{ m.offsetY }}
          </div>
        </div>
        <div>
          <h5>PAWNS</h5>
          <div :key="p.id" v-for="p in pawns">
            {{ p.id }}, {{ p.offsetX }}, {{ p.offsetY }}
          </div>
        </div>
      </div>
    </div>
    <svg
      id="svg-table"
      :style="{
        backgroundColor: 'ghostwhite',
        width: svgWidth,
        height: svgHeight
      }"
    >
      <g
        :id="`board_${activeBoard.id}`"
        v-if="activeBoard"
        :style="{
          transform: `translate(${XIntercept}px, ${YIntercept}px) scale(${Z})`
        }"
        @mousedown="onMouseDown(activeBoard.id, $event)"
      >
        <rect
          width="3000"
          height="3000"
          x="0"
          y="0"
          style="fill: rosybrown;"
        ></rect>
        <svg-map v-for="m in maps" :key="m.id" :map-id="m.id"></svg-map>
        <svg-pawn v-for="p in pawns" :key="p.id" :pawn-id="p.id"></svg-pawn>
        <circle r="2" cx="0" cy="0" style="fill: red;stroke: none;"></circle>
        <text>O: {{ XIntercept }},{{ YIntercept }} - {{ activeBoard.id }}</text>
      </g>
    </svg>
  </div>
</template>

<script>
import SvgMap from "@/components/organisms/SvgMap";
import SvgPawn from "@/components/organisms/SvgPawn";
export default {
  name: "SvgBoard",
  components: { SvgPawn, SvgMap },
  methods: {
    resize(width, height) {
      this.svgWidth = width;
      this.svgHeight = height;
    },
    onMouseDown(boardId, e) {
      const idString = `board_${this.activeBoard.id}`;
      const $el = document.getElementById(idString);
      $el.classList.add("drag");

      const $svg = document.getElementById("svg-table");
      const { x: svgX, y: svgY } = $svg.getBoundingClientRect();

      /* オフセット: $elの左上を0とした時のクリックした点の座標
       * 画面左上 - $elの左上 */
      const { left, top } = e.currentTarget.getBoundingClientRect();
      const { x: _x, y: _y } = e.currentTarget.getBBox();
      const { Z } = this;
      const x = _x * Z;
      const y = _y * Z;
      const oX = e.clientX - left + x;
      const oY = e.clientY - top + y;

      const onMove = e => {
        e.stopPropagation();
        this.XIntercept = e.clientX - svgX - oX;
        this.YIntercept = e.clientY - svgY - oY;
      };

      const onMouseUp = e => {
        e.stopPropagation();
        console.log("SvgBoard.onMouseUp"); // @DELETEME
        /* 新しいpawnの座標 === 画面マウス位置 - オフセット */
        this.XIntercept = e.clientX - svgX - oX;
        this.YIntercept = e.clientY - svgY - oY;
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
      return this.$store.getters["pawn/info"].filter(
        p => p.board === activeBoardId
      );
    },
    svgSize() {
      const $el = document.getElementById("svg-table");
      if (!$el) {
        return { width: 0, height: 0 };
      }
      const { width, height } = $el.getBoundingClientRect();
      return { width, height };
    },
    Z() {
      return this.Zoom / 100;
    }
  },
  data() {
    return {
      debug: false,
      svgWidth: 0,
      svgHeight: 0,
      XIntercept: 0,
      YIntercept: 0,
      Zoom: 100
    };
  }
};
</script>

<style scoped></style>
