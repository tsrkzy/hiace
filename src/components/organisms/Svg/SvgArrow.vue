<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <g :id="`arrow_${arrowId}`">
    <path
      v-if="!archived && !mapDragging"
      stroke="red"
      stroke-width="2"
      :d="path"
    />
  </g>
</template>

<script>
import { FSArrow } from "@/collections/Arrow";
import { FSPawn, PAWN_UNIT_SIZE } from "@/collections/Pawn";

export default {
  name: "SvgArrow",
  props: {
    arrowId: { type: String, require: true },
  },
  async created() {
    if (!this.arrowId) {
      return false;
    }

    const { pawnFrom, pawnTo } = await FSArrow.GetById({
      id: this.arrowId,
    });

    /* archived済みのcharacterのpawnは無視するため控えておく */
    const { character: characterFrom } = await FSPawn.GetById({
      id: pawnFrom,
    });
    const { character: characterTo } = await FSPawn.GetById({
      id: pawnTo,
    });

    /* 存在しないPawnを参照していたらArrowを消す */
    this.pawnIdFrom = pawnFrom;
    this.pawnIdTo = pawnTo;
    this.characterIdFrom = characterFrom;
    this.characterIdTo = characterTo;
  },
  computed: {
    path() {
      if (!this.pawnFrom || !this.pawnTo) {
        return null;
      }
      const { transform: transformFrom = "", character: characterIdFrom } =
        this.pawnFrom;
      const { transform: transformTo = "", character: characterIdTo } =
        this.pawnTo;
      const characters = this.$store.getters["character/info"];
      const characterFrom = characters.find((c) => c.id === characterIdFrom);
      const characterTo = characters.find((c) => c.id === characterIdTo);
      const pawnSizeFrom = characterFrom.pawnSize;
      const pawnSizeTo = characterTo.pawnSize;

      const tFrom = new DOMMatrix(transformFrom);
      const tTo = new DOMMatrix(transformTo);

      const _xFrom = tFrom.e;
      const _yFrom = tFrom.f;
      const xFrom = _xFrom + (pawnSizeFrom * PAWN_UNIT_SIZE) / 2;
      const yFrom = _yFrom + (pawnSizeFrom * PAWN_UNIT_SIZE) / 2;

      const _xTo = tTo.e;
      const _yTo = tTo.f;
      const xTo = _xTo + (pawnSizeTo * PAWN_UNIT_SIZE) / 2;
      const yTo = _yTo + (pawnSizeTo * PAWN_UNIT_SIZE) / 2;

      /* 2つのpawnの間に矢印を描画 */
      return `M ${xFrom},${yFrom}
              L ${xTo},${yTo}
                         z`;
    },
    pawnFrom() {
      return this.$store.getters["pawn/info"].find(
        (p) => p.id === this.pawnIdFrom
      );
    },
    pawnTo() {
      return this.$store.getters["pawn/info"].find(
        (p) => p.id === this.pawnIdTo
      );
    },
    characterFrom() {
      return this.$store.getters["character/info"].find(
        (c) => c.id === this.characterIdFrom
      );
    },
    characterTo() {
      return this.$store.getters["character/info"].find(
        (c) => c.id === this.characterIdTo
      );
    },
    archived() {
      /* 参照しているpawnのうち、少なくとも片方がarchiveならtrue */
      if (!this.characterFrom || !this.characterTo) {
        return true;
      }

      return this.characterFrom.archived || this.characterTo.archived;
    },
    mapDragging() {
      return this.$store.getters["map/dragging"];
    },
  },
  methods: {},
  data() {
    return {
      pawnIdFrom: null,
      pawnIdTo: null,
      characterIdFrom: null,
      characterIdTo: null,
      loaded: false,
    };
  },
};
</script>

<style scoped lang="scss"></style>
