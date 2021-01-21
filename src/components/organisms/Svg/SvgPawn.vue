<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <g
    :id="shadow ? `shadow_pawn_${pawnId}` : `pawn_${pawnId}`"
    v-if="loaded && shadowHandler"
    :style="{
      transform: `${transform}`
    }"
    @mousedown="onMouseDown($event)"
    @mouseenter="onMouseEnter($event)"
    :filter="shadow ? `url(#shadow_filter_${pawnId})` : ''"
  >
    <filter :id="`shadow_filter_${pawnId}`">
      <feColorMatrix in="SourceGraphic" type="saturate" values="0.1" />
    </filter>
    <!-- 外枠 -->
    <rect
      :width="pawnSize"
      :height="pawnSize"
      stroke="black"
      fill="rgba(0,0,0,0.2)"
    ></rect>
    <!-- ビルボード -->
    <rect :width="pawnSize" height="10" stroke="black" fill="black"></rect>
    <text x="0" y="8" fill="white">{{ character.name }}</text>
    <image
      v-if="!shadow"
      preserveAspectRatio="xMidYMid meet"
      :width="pawnSize"
      :height="pawnSize"
      :href="imgSrc"
    ></image>
    <!-- ドラッグ中の当たり判定拡張 -->
    <rect
      v-if="dragged"
      :x="-1000 / 2"
      :y="-1000 / 2"
      :width="pawnSize + 1000"
      :height="pawnSize + 1000"
      stroke="transparent"
      fill="transparent"
    ></rect>
  </g>
</template>

<script>
import { FSCharacter } from "@/collections/Character";
import { FSImage } from "@/collections/Image";
import { FSPawn } from "@/collections/Pawn";

export default {
  name: "SvgPawn",
  props: {
    pawnId: { type: String, require: true },
    shadow: { type: Boolean, default: false }
  },
  async created() {
    if (!this.pawnId) {
      return false;
    }

    const { character, transform } = await FSPawn.GetById({
      id: this.pawnId
    });
    const image = await FSCharacter.GetAliasImage(character);

    this.transform = transform;

    if (!image) {
      console.warn(`pawn has no image: ${this.pawnId}`);
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
      return this.$store.getters["image/info"].find(img => img.id === id) || {};
    },
    pawn() {
      const id = this.pawnId;
      return this.$store.getters["pawn/info"].find(p => p.id === id) || {};
    },
    character() {
      const { character: characterId } = this.pawn;
      return (
        this.$store.getters["character/info"].find(c => c.id === characterId) ||
        {}
      );
    },
    pawnSize() {
      const size = this.character?.pawnSize ?? 1;
      return 120 * size;
    },
    alias() {
      const { activeAlias = "" } = this.character;
      return (
        this.$store.getters["alias/info"].find(a => a.id === activeAlias) || {}
      );
    },
    imgSrc() {
      const { image } = this.alias;
      if (!image) {
        return null;
      }

      const { url = "" } = this.$store.getters["image/info"].find(
        i => i.id === image
      );
      return url || this.href;
    },
    activeBoard() {
      return this.$store.getters["board/active"];
    },
    transformStore() {
      return this?.pawn.transform || new DOMMatrix();
    },
    shadowHandler() {
      const drag = this.$store.getters["pawn/dragging"];
      const { shadow, pawnId } = this;

      if (!drag) {
        /* ドラッグ中でなければshadowは表示しない */
        return !shadow;
      }

      /* ドラッグ中 かつ
       * 他pawnをドラッグ中: shadowのみ表示
       * このpawnをドラッグ中: shadowも表示 */
      return drag !== pawnId ? shadow : true;
    },
    dragged() {
      return this.$store.getters["pawn/dragging"] === this.pawnId;
    }
  },
  methods: {
    onMouseDown(e) {
      if (this.shadow) {
        return;
      }
      console.log("SvgPawn.onMouseDown"); // @DELETEME
      e.stopPropagation();

      this.$store.dispatch("pawn/dragStart", { pawnId: this.pawnId });

      const $p = document.getElementById(`pawn_${this.pawnId}`);

      const downX = e.clientX;
      const downY = e.clientY;

      /* globalの座標系をboard,pawnの座標系へ変換する行列 */
      const $b = document.getElementById(`board_${this.activeBoard.id}`);
      const $$b = $b.getCTM(); // global -> board
      const $$p = $p.getCTM(); // global -> pawn
      const $$bp = $$b.inverse().multiply($$p); // board -> pawn

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
        $p.style.transform = `${t}`;
      };

      const onMouseUp = async e => {
        e.stopPropagation();
        console.log("SvgPawn.onMouseUp"); // @DELETEME
        await this.$store.dispatch("pawn/dragFinish");
        $p.removeEventListener("mousemove", onMove);
        $p.removeEventListener("mouseup", onMouseUp);
        $p.removeEventListener("mouseleave", onMouseUp);

        const t = globalToLocal(e.clientX - downX, e.clientY - downY);
        const transform = `${t}`;
        this.transform = transform;
        await FSPawn.Update(this.pawnId, { transform });
      };

      $p.addEventListener("mousemove", onMove, false);
      $p.addEventListener("mouseup", onMouseUp, false);
      $p.addEventListener("mouseleave", onMouseUp, false);

      return false;
    },
    async onMouseEnter(e) {
      if (this.shadow) {
        return;
      }
      e.stopPropagation();
      const { screenX: x } = e;
      const { innerWidth: w } = window;
      const side = x < w / 2 ? "left" : "right";
      const text = this.character.text;
      await this.$store.dispatch("detail/setContent", { text, side });

      const $p = document.getElementById(`pawn_${this.pawnId}`);
      const onLeave = async e => {
        e.stopPropagation();
        await this.$store.dispatch("detail/off");
        $p.removeEventListener("mouseleave", onLeave);
      };
      $p.addEventListener("mouseleave", onLeave, false);
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
