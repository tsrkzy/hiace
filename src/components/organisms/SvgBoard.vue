<template>
  <div>
    <div style="position:fixed; top:0; right:0;">
      <!-- debug -->
      <div>
        <h5>BOARD</h5>
        <div>
          <label>
            <span>debug: </span>
            <input type="checkbox" v-model="debug" />
          </label>
        </div>
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
              min="-300"
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
              min="-300"
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
        v-if="activeBoard"
        :style="{ transform: `translate(${XIntercept}px, ${YIntercept}px)` }"
      >
        <text>O. {{ activeBoard.id }}</text>
        <circle r="2" cx="0" cy="0" style="fill: red;stroke: none;"></circle>
        <rect
          :width="Z * svgWidth"
          :height="Z * svgHeight"
          style="fill: aqua; opacity:0.2;"
        ></rect>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: "SvgBoard",
  methods: {
    resize(width, height) {
      this.svgWidth = width;
      this.svgHeight = height;
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
      debug: true,
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
