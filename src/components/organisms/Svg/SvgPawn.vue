<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <g
    :id="shadow ? `shadow_pawn_${pawnId}` : `pawn_${pawnId}`"
    v-if="!archived && loaded && shadowHandler"
    :style="{ transform: `${transform}` }"
    class="token-transition"
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
    <!-- 控室 -->
    <path
      v-if="archived"
      :d="`M 0,0 L ${pawnSize},${pawnSize} z`"
      stroke="black"
    ></path>
    <path
      v-if="archived"
      :d="`M 0,${pawnSize} L ${pawnSize},0 z`"
      stroke="black"
    ></path>
    <!-- 画像 -->
    <image
      v-if="!shadow"
      preserveAspectRatio="xMidYMid meet"
      :width="pawnSize"
      :height="pawnSize"
      :href="imgSrc"
    ></image>
    <!-- ビルボード -->
    <rect :width="pawnSize" height="12" stroke="black" fill="black"></rect>
    <text x="0" y="12" fill="lightgray"
      >{{ characterName }} #{{ pawnId.slice(0, 3) }}</text
    >
    <text x="0" y="12" fill="white">{{ characterName }}</text>
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
import { FSPawn, PAWN_UNIT_SIZE } from "@/collections/Pawn";
import { showContext } from "@/scripts/Contextmenu";
import { touch } from "@/scripts/touch";

export default {
  name: "SvgPawn",
  props: {
    pawnId: { type: String, require: true },
    shadow: { type: Boolean, default: false },
  },
  async created() {
    if (!this.pawnId) {
      return false;
    }

    const { character, transform } = await FSPawn.GetById({
      id: this.pawnId,
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
      return (
        this.$store.getters["image/info"].find((img) => img.id === id) || {}
      );
    },
    pawn() {
      const id = this.pawnId;
      return this.$store.getters["pawn/info"].find((p) => p.id === id) || {};
    },
    character() {
      const { character: characterId } = this.pawn;
      return (
        this.$store.getters["character/info"].find(
          (c) => c.id === characterId
        ) || {}
      );
    },
    archived() {
      return !!this.character?.archived;
    },
    characterName() {
      const { character, archived } = this;
      return archived ? `${character.name}[控室]` : character.name;
    },
    pawnSize() {
      const size = this.character?.pawnSize ?? 1;
      return PAWN_UNIT_SIZE * size;
    },
    alias() {
      const { activeAlias = "" } = this.character;
      return (
        this.$store.getters["alias/info"].find((a) => a.id === activeAlias) ||
        {}
      );
    },
    imgSrc() {
      const { image } = this.alias;
      if (!image) {
        return null;
      }

      const { url = "" } = this.$store.getters["image/info"].find(
        (i) => i.id === image
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
      /* マップの位置変更中は非表示 */
      const m = this.$store.getters["map/dragging"];
      if (m) {
        return false;
      }

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
    },
  },
  methods: {
    onMouseDown(e) {
      console.log("SvgPawn.onMouseDown");
      if (this.shadow) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();

      /* 右クリック、またはctrlと一緒に押下した場合はcontextMenuとして扱う */
      const isContextmenu = e.button === 2 || e.ctrlKey;
      if (isContextmenu) {
        /* macの右クリックはここ */
        this.showContext(e);
        return false;
      }

      this.moveStart(e);
      return false;
    },
    async onMouseEnter(e) {
      if (this.shadow) {
        return;
      }
      e.stopPropagation();
      const { pageX: x } = e;
      const { innerWidth: w } = window;
      const side = x < w / 2 ? "left" : "right";
      const text = this.character.text;
      await this.$store.dispatch("detail/setContent", { text, side });

      const $p = document.getElementById(`pawn_${this.pawnId}`);
      const onLeave = async (e) => {
        e.stopPropagation();
        await this.$store.dispatch("detail/off");
        $p.removeEventListener("mouseleave", onLeave);
      };
      $p.addEventListener("mouseleave", onLeave, false);
    },
    onContextmenu(e) {
      console.log("SvgPawn.onContextmenu");
      /* windowsの右クリックはここに来る */
      this.showContext(e);
    },
    showContext(e) {
      console.log("SvgPawn.showContext");
      showContext(e, "pawn", this.pawnId);
    },
    moveStart(e) {
      this.$store.dispatch("pawn/dragStart", { pawnId: this.pawnId });

      const $p = document.getElementById(`pawn_${this.pawnId}`);

      /* transformのtransitionを削除 */
      $p.classList.remove("token-transition");

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

      const onMove = (e) => {
        e.stopPropagation();
        const t = globalToLocal(e.clientX - downX, e.clientY - downY);
        $p.style.transform = `${t}`;
      };

      const onMouseUp = async (e) => {
        e.stopPropagation();
        console.log("SvgPawn.onMouseUp"); // @DELETEME
        await this.$store.dispatch("pawn/dragFinish");
        $p.classList.add("token-transition");
        $p.removeEventListener("mousemove", onMove);
        $p.removeEventListener("mouseup", onMouseUp);
        $p.removeEventListener("mouseleave", onMouseUp);

        const t = globalToLocal(e.clientX - downX, e.clientY - downY);
        const transform = `${t}`;
        this.transform = transform;
        await FSPawn.Touch(this.pawnId);
        await FSPawn.Update(this.pawnId, { transform });
        touch("コマ", "character", this.pawn.character);
      };

      $p.addEventListener("mousemove", onMove, false);
      $p.addEventListener("mouseup", onMouseUp, false);
      $p.addEventListener("mouseleave", onMouseUp, false);

      return false;
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
    transformStore(transform) {
      console.log("update store.pawn.transform", transform); // @DELETEME
      this.transform = transform;
    },
  },
};
</script>

<style scoped lang="scss"></style>
