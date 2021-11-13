<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <g
    :id="shadow ? `shadow_dice_${diceId}` : `dice_${diceId}`"
    v-if="shadowHandler"
    :style="{ transform: `${transform}` }"
    class="token-transition"
    :class="`dice_${faceStore}`"
    @mousedown="onMouseDown($event)"
  >
    <!-- 外枠 -->
    <rect
      :width="diceSize"
      :height="diceSize"
      :stroke="frameColor"
      fill="rgba(0,0,0,0.2)"
    ></rect>
    <!-- ダイスの面と目 -->
    <g v-if="!shadow">
      <aster
        v-if="faceIsAster"
        :color="colorStore"
        :dice-size="diceSize"
      ></aster>
      <die
        v-else
        :dice="faceStore"
        :color="colorStore"
        :dice-size="diceSize"
      ></die>
    </g>
    <!-- ドラッグ中の当たり判定拡張 -->
    <rect
      v-if="dragged"
      :x="-1000 / 2"
      :y="-1000 / 2"
      :width="diceSize + 1000"
      :height="diceSize + 1000"
      stroke="transparent"
      fill="transparent"
    ></rect>
  </g>
</template>

<script>
import {
  DICE_BLACK,
  DICE_EYE_COLOR,
  DICE_SIZE,
  DICE_VALUE_ASTER,
  FSDice
} from "@/collections/Dice";
import Aster from "@/components/organisms/Svg/face/Aster";
import Die from "@/components/organisms/Svg/face/Die";
import { showContext } from "@/scripts/Contextmenu";
import { touchFree } from "@/scripts/touch";

export default {
  name: "SvgDice",
  components: { Die, Aster },
  props: {
    diceId: { type: String, require: true },
    shadow: { type: Boolean, default: false }
  },
  async created() {
    if (!this.diceId) {
      return false;
    }

    const { transform } = await FSDice.GetById({
      id: this.diceId
    });

    this.transform = transform;
  },
  computed: {
    dice() {
      const id = this.diceId;
      return this.$store.getters["dice/info"].find(d => d.id === id) || {};
    },
    diceSize() {
      return DICE_SIZE;
    },
    activeBoard() {
      return this.$store.getters["board/active"];
    },
    transformStore() {
      return this?.dice.transform || new DOMMatrix();
    },
    faceIsAster() {
      return this.faceStore === DICE_VALUE_ASTER;
    },
    faceStore() {
      return this?.dice.face || DICE_VALUE_ASTER;
    },
    colorStore() {
      return this?.dice.color || DICE_BLACK;
    },
    frameColor() {
      return DICE_EYE_COLOR[this.colorStore];
    },
    shadowHandler() {
      /* マップの位置変更中は非表示 */
      const m = this.$store.getters["map/dragging"];
      if (m) {
        return false;
      }

      /* pawnをドラッグ中はshadowのみ表示 */
      const p = this.$store.getters["pawn/dragging"];
      if (p) {
        return this.shadow;
      }

      const drag = this.$store.getters["dice/dragging"];
      const { diceId } = this;

      if (!drag) {
        /* diceをドラッグ中でないならshadowは非表示 */
        return !this.shadow;
      } else {
        /* diceをドラッグ中なら下の2つのみ表示
         * 1. ドラッグした対象
         * 2. ドラッグした対象以外のshadow */
        return drag === diceId || (drag !== diceId && this.shadow);
      }
    },
    dragged() {
      return this.$store.getters["dice/dragging"] === this.diceId;
    }
  },
  methods: {
    onMouseDown(e) {
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
    onContextmenu(e) {
      /* windowsの右クリックはここに来る */
      this.showContext(e);
    },
    showContext(e) {
      showContext(e, "dice", this.diceId);
    },
    moveStart(e) {
      this.$store.dispatch("dice/dragStart", { diceId: this.diceId });

      const $d = document.getElementById(`dice_${this.diceId}`);

      /* transformのtransitionを削除 */
      $d.classList.remove("token-transition");

      const downX = e.clientX;
      const downY = e.clientY;

      /* globalの座標系をboard,diceの座標系へ変換する行列 */
      const $b = document.getElementById(`board_${this.activeBoard.id}`);
      const $$b = $b.getCTM(); // global -> board
      const $$d = $d.getCTM(); // global -> dice
      const $$bd = $$b.inverse().multiply($$d); // board -> dice

      function globalToLocal(dx, dy) {
        /* 変位をglobalからDOMローカルの座標系へ変換 */
        return new DOMMatrix([1, 0, 0, 1, dx / $$d.a, dy / $$d.a]).translate(
          $$bd.e,
          $$bd.f
        );
      }

      const onMove = e => {
        e.stopPropagation();
        const t = globalToLocal(e.clientX - downX, e.clientY - downY);
        $d.style.transform = `${t}`;
      };

      const onMouseUp = async e => {
        e.stopPropagation();
        await this.$store.dispatch("dice/dragFinish");
        $d.classList.add("token-transition");
        $d.removeEventListener("mousemove", onMove);
        $d.removeEventListener("mouseup", onMouseUp);
        $d.removeEventListener("mouseleave", onMouseUp);

        const t = globalToLocal(e.clientX - downX, e.clientY - downY);
        const transform = `${t}`;
        this.transform = transform;
        await FSDice.Touch(this.diceId);
        await FSDice.Update(this.diceId, { transform });
        touchFree("ダイスを動かしました");
      };

      $d.addEventListener("mousemove", onMove, false);
      $d.addEventListener("mouseup", onMouseUp, false);
      $d.addEventListener("mouseleave", onMouseUp, false);

      return false;
    }
  },
  data() {
    return {
      transform: `${new DOMMatrix()}`
    };
  },
  watch: {
    transformStore(transform) {
      this.transform = transform;
    }
  }
};
</script>

<style scoped lang="scss"></style>
