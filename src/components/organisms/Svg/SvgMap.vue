<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <g
    :id="`map_${this.mapId}`"
    v-if="loaded"
    :style="{
      transform: `${transform}`,
    }"
    @mousedown="onMouseDown($event)"
  >
    <rect
      :width="width"
      :height="height"
      stroke="red"
      fill="transparent"
    ></rect>
    <rect
      :width="width"
      :height="height"
      stroke="transparent"
      fill="dimgray"
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
import { showContext } from "@/scripts/Contextmenu";
import { Notify } from "@/scripts/Notify";

export default {
  name: "SvgMap",
  props: {
    mapId: { type: String, require: true },
  },
  async created() {
    if (!this.mapId) {
      return false;
    }

    const { image, transform = new DOMMatrix() } = await FSMap.GetById({
      id: this.mapId,
    });

    this.transform = transform;

    if (!image) {
      Notify.Log("マップに画像が割り当てられていない");
      this.imageId = null;
      this.width = 400;
      this.height = 400;
    } else {
      await this.fetchImage(image);
    }

    this.loaded = true;
  },
  computed: {
    z() {
      return this.scalePp / 100;
    },
    image() {
      const id = this.imageId;
      return this.$store.getters["image/info"].find((img) => img.id === id);
    },
    map() {
      const id = this.mapId;
      return this.$store.getters["map/info"].find((m) => m.id === id);
    },
    activeBoard() {
      return this.$store.getters["board/active"];
    },
    transformStore() {
      return this?.map.transform || new DOMMatrix();
    },
    dragged() {
      return this.$store.getters["map/dragging"] === this.mapId;
    },
    locked() {
      return !!this?.map?.dragLock;
    },
  },
  methods: {
    async fetchImage(imageId) {
      this.imageId = imageId;
      const { url, width, height } = await FSImage.GetById({
        id: this.imageId,
      });

      this.width = width;
      this.height = height;
      this.href = url;
    },
    async onMouseDown(e) {
      console.log("SvgMap.onMouseDown"); // @DELETEME

      /* 右クリック、またはctrlと一緒に押下した場合はcontextMenuとして扱う */
      const isContextmenu = e.button === 2 || e.ctrlKey;
      if (isContextmenu) {
        /* macの右クリックはここ */
        e.preventDefault();
        e.stopPropagation();
        this.showContext(e);
        return false;
      }

      if (this.locked) {
        console.log(`map is locked. ${this.mapId}`); // @DELETEME
        return false;
      }
      e.stopPropagation();

      await this.moveStart(e);
      return false;
    },
    async moveStart(e) {
      await this.$store.dispatch("map/dragStart", { mapId: this.mapId });

      const $m = document.getElementById(`map_${this.mapId}`);

      const downX = e.clientX;
      const downY = e.clientY;

      /* globalの座標系をboard,mapの座標系へ変換する行列 */
      const $b = document.getElementById(`board_${this.activeBoard.id}`);
      const $$b = $b.getCTM(); // global -> board
      const $$m = $m.getCTM(); // board -> map
      const $$bm = $$b.inverse().multiply($$m); // global -> map

      function globalToLocal(dx, dy) {
        /* 変位をglobalからDOMローカルの座標系へ変換 */
        const init = [$$bm.a, $$bm.b, $$bm.c, $$bm.d, $$bm.e, $$bm.f];
        const $$r = new DOMMatrix(init);
        const dxx = dx / $$m.a;
        const dyy = dy / $$m.a;
        return $$r.translate(dxx, dyy);
      }

      const onMove = (e) => {
        e.stopPropagation();
        const t = globalToLocal(e.clientX - downX, e.clientY - downY);
        $m.style.transform = `${t}`;
      };

      const onMouseUp = async (e) => {
        e.stopPropagation();
        console.log("SvgMap.onMouseUp"); // @DELETEME
        await this.$store.dispatch("map/dragFinish");
        $m.removeEventListener("mousemove", onMove);
        $m.removeEventListener("mouseup", onMouseUp);
        $m.removeEventListener("mouseleave", onMouseUp);

        const t = globalToLocal(e.clientX - downX, e.clientY - downY);
        const transform = `${t}`;
        this.transform = transform;
        await FSMap.Update(this.mapId, { transform });
      };

      $m.addEventListener("mousemove", onMove, false);
      $m.addEventListener("mouseup", onMouseUp, false);
      $m.addEventListener("mouseleave", onMouseUp, false);
    },
    showContext(e) {
      console.log("SvgMap.showContext");
      showContext(e, "map", this.mapId);
    },
  },
  data() {
    return {
      transform: `${new DOMMatrix()}`,

      /* image */
      imageId: null,
      width: 0,
      height: 0,
      href: null,

      loaded: false,
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
    },
    image(image) {
      if (!!image.id) {
        this.fetchImage(image.id)
          .then(() => {
            this.loaded = true;
          })
          .catch((e) => {
            console.error(e);
            Notify.Log("マップ画像の読み込みに失敗");
          });
      }
    },
  },
};
</script>

<style scoped></style>
