<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <g
    :id="`map_${this.mapId}`"
    v-if="loaded"
    :style="{
      transform: `${transform}`
    }"
    @mousedown="onMouseDown($event)"
  >
    <text>{{ imageId }} {{ transform }}</text>
    <rect
      :width="width"
      :height="height"
      stroke="red"
      fill="transparent"
    ></rect>
    <image :width="width" :height="height" :href="href"></image>
    <!-- ドラッグ中の当たり判定拡張 -->
    <rect
      v-if="dragged"
      :x="-1000 / 2"
      :y="-1000 / 2"
      :width="width + 1000"
      :height="height + 1000"
      stroke="red"
      fill="transparent"
    ></rect>
  </g>
</template>

<script>
import { FSImage } from "@/collections/Image";
import { FSMap } from "@/collections/Map";

export default {
  name: "SvgMap",
  props: {
    mapId: { type: String, require: true }
  },
  async created() {
    if (!this.mapId) {
      return false;
    }

    const { image, transform = new DOMMatrix() } = await FSMap.GetById({
      id: this.mapId
    });

    this.transform = transform;

    if (!image) {
      throw new Error(`map has no image: ${this.mapId}`);
    }
    await this.fetchImage(image);

    this.loaded = true;
  },
  computed: {
    z() {
      return this.scalePp / 100;
    },
    image() {
      const id = this.imageId;
      return this.$store.getters["image/info"].find(img => img.id === id);
    },
    map() {
      const id = this.mapId;
      return this.$store.getters["map/info"].find(m => m.id === id);
    },
    activeBoard() {
      return this.$store.getters["board/active"];
    },
    transformStore() {
      return this?.map.transform || new DOMMatrix();
    },
    dragged() {
      return this.$store.getters["map/dragging"] === this.mapId;
    }
  },
  methods: {
    async fetchImage(image) {
      this.imageId = image;
      const { url, width, height } = await FSImage.GetById({
        id: this.imageId
      });

      this.width = width;
      this.height = height;
      this.href = url;
    },
    onMouseDown(e) {
      console.log("SvgMap.onMouseDown"); // @DELETEME
      e.stopPropagation();

      this.$store.dispatch("map/dragStart", { mapId: this.mapId });

      const $p = document.getElementById(`map_${this.mapId}`);

      const downX = e.clientX;
      const downY = e.clientY;

      /* globalの座標系をboard,mapの座標系へ変換する行列 */
      const $b = document.getElementById(`board_${this.activeBoard.id}`);
      const $$b = $b.getCTM(); // global -> board
      const $$p = $p.getCTM(); // global -> map
      const $$bp = $$b.inverse().multiply($$p); // board -> map

      function globalToLocal(dx, dy) {
        /* 変位をglobalからDOMローカルの座標系へ変換 */
        return new DOMMatrix([1, 0, 0, 1, dx / $$p.a, dy / $$p.a]).translate(
          $$bp.e,
          $$bp.f
        );
      }

      const onMove = e => {
        e.stopPropagation();
        const t = globalToLocal(e.clientX - downX, e.clientY - downY);
        this.transform = `${t}`;
      };

      const onMouseUp = async e => {
        e.stopPropagation();
        console.log("SvgMap.onMouseUp"); // @DELETEME
        await this.$store.dispatch("map/dragFinish");
        $p.removeEventListener("mousemove", onMove);
        $p.removeEventListener("mouseup", onMouseUp);
        $p.removeEventListener("mouseleave", onMouseUp);

        const t = globalToLocal(e.clientX - downX, e.clientY - downY);
        const transform = `${t}`;
        this.transform = transform;
        await FSMap.Update(this.mapId, { transform });
      };

      $p.addEventListener("mousemove", onMove, false);
      $p.addEventListener("mouseup", onMouseUp, false);
      $p.addEventListener("mouseleave", onMouseUp, false);

      return false;
    }
  },
  data() {
    return {
      transform: `${new DOMMatrix()}`,

      /* image */
      imageId: null,
      width: 0,
      height: 0,
      href: null,

      loaded: false
    };
  },
  watch: {
    map(map) {
      const { image } = map;
      this.fetchImage(image);
    },
    transformStore(transform) {
      console.log("update store.map.transform", transform); // @DELETEME
      this.transform = transform;
    }
  }
};
</script>

<style scoped></style>
