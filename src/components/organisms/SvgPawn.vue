<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <g
    :id="`pawn_${pawnId}`"
    v-if="loaded"
    :style="{
      transform: `${transform}`
    }"
    @mousedown="onMouseDown($event)"
  >
    <text>{{ imageId }}, {{ width }}, {{ height }}</text>
    <image :width="width" :height="height" :href="href"></image>
    <rect
      :width="width"
      :height="height"
      stroke="red"
      fill="transparent"
    ></rect>
  </g>
</template>

<script>
import { FSImage } from "@/collections/Image";
import { FSPawn } from "@/collections/Pawn";

export default {
  name: "SvgPawn",
  props: {
    pawnId: { type: String, require: true }
  },
  async created() {
    if (!this.pawnId) {
      return false;
    }

    const { image } = await FSPawn.GetById({
      id: this.pawnId
    });

    if (!image) {
      console.warn(`pawn ${this.pawnId} has no image`);
      return false;
    }
    const { url, width, height } = await FSImage.GetById({ id: image });

    /* image */
    this.imageId = image;
    this.width = width;
    this.height = height;
    this.href = url;

    this.loaded = true;
  },
  computed: {
    image() {
      const id = this.imageId;
      return this.$store.getters["image/info"].find(img => img.id === id);
    },
    pawn() {
      const id = this.pawnId;
      return this.$store.getters["pawn/info"].find(m => m.id === id);
    },
    activeBoard() {
      return this.$store.getters["board/active"];
    },
    transformStore() {
      return this?.pawn.transform;
    }
  },
  methods: {
    onMouseDown(e) {
      e.stopPropagation();

      const $p = document.getElementById(`pawn_${this.pawnId}`);

      const downX = e.clientX;
      const downY = e.clientY;

      /* globalの座標系をboard,pawnの座標系へ変換する行列 */
      const $b = document.getElementById(`board_${this.activeBoard.id}`);
      const $$b = $b.getCTM(); // global -> board
      const $$p = $p.getCTM(); // global -> pawn
      const $$bp = $$b.inverse().multiply($$p); // board -> pawn

      function globalToLocal(dx, dy /*, ctm*/) {
        /* 変位をglobalからDOMローカルの座標系へ変換 */
        return new DOMMatrix([1, 0, 0, 1, dx / $$p.a, dy / $$p.a]).translate(
          $$bp.e,
          $$bp.f
        );
      }

      const onMove = e => {
        e.stopPropagation();
        const t = globalToLocal(e.clientX - downX, e.clientY - downY /*, $$*/);
        this.transform = `${t}`;
      };

      const onMouseUp = e => {
        e.stopPropagation();
        console.log("SvgPawn.onMouseUp"); // @DELETEME
        const t = globalToLocal(e.clientX - downX, e.clientY - downY /*, $$*/);
        this.transform = `${t}`;
        $p.removeEventListener("mousemove", onMove);
        $p.removeEventListener("mouseup", onMouseUp);
        $p.removeEventListener("mouseleave", onMouseUp);
      };

      $p.addEventListener("mousemove", onMove, false);
      $p.addEventListener("mouseup", onMouseUp, false);
      $p.addEventListener("mouseleave", onMouseUp, false);
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
    transformStore(transform) {
      console.log("update store.pawn.transform", transform); // @DELETEME
      this.transform = transform;
    }
  }
};
</script>

<style scoped lang="scss"></style>
