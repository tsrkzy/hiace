<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    <label>
      x:{{ x }}
      <input
        type="range"
        min="-100"
        max="100"
        step="1"
        :value="x"
        @change="onChangeOffSetXHandler(pawnId, $event)"
      />
    </label>
    <label>
      y:{{ y }}
      <input
        type="range"
        min="-100"
        max="100"
        step="1"
        :value="y"
        @change="onChangeOffSetYHandler(pawnId, $event)"
      />
    </label>
    <label>
      scale:{{ scale }}
      <input
        type="range"
        min="50"
        max="200"
        step="1"
        :value="scale"
        @change="onChangeScaleHandler(pawnId, $event)"
      />
    </label>
    <img :src="imageUrl" :alt="pawnId" :width="24" :height="24" />
    <ha-button @click="onClickDeletePawn(pawnId)"
      >DELETE PAWN: {{ pawnId }}
    </ha-button>
  </div>
</template>

<script>
import { FSImage } from "@/collections/Image";
import { FSPawn } from "@/collections/Pawn";
import HaButton from "@/components/atoms/HaButton";

export default {
  name: "PawnEditor",
  components: { HaButton },
  props: {
    pawnId: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      image: null
    };
  },
  async created() {
    if (this.pawn) {
      if (!this.pawn.image) {
        console.warn(`pawn ${this.pawnId} has no image`);
        return false;
      }
      console.log("load image"); // @DELETEME
      this.image = await FSImage.GetById({ id: this.pawn.image });
    } else {
      console.log("load pawn then load image"); // @DELETEME
      const { image } = await FSPawn.GetById({ id: this.pawnId });
      this.image = await FSImage.GetById({ id: image });
    }
  },
  computed: {
    pawn() {
      return this.$store.getters["pawn/info"].find(p => p.id === this.pawnId);
    },
    imageUrl() {
      return this.image ? this.image.url : "";
    },
    x() {
      return this.pawn?.offsetX ?? 0;
    },
    y() {
      return this.pawn?.offsetY ?? 0;
    },
    scale() {
      return this.pawn?.scalePp ?? 0;
    }
  },
  methods: {
    async onClickDeletePawn(pawnId) {
      await FSPawn.Delete(pawnId);
    },
    async onChangeOffSetXHandler(pawnId, e) {
      const { value } = e.currentTarget;
      await this.updatePawnShape(pawnId, "offsetX", value);
    },
    async onChangeOffSetYHandler(pawnId, e) {
      const { value } = e.currentTarget;
      await this.updatePawnShape(pawnId, "offsetY", value);
    },
    async onChangeScaleHandler(pawnId, e) {
      const { value } = e.currentTarget;
      await this.updatePawnShape(pawnId, "scalePp", value);
    },
    async updatePawnShape(pawnId, key, value) {
      const v = parseInt(value, 10);
      if (isNaN(v)) {
        throw new Error("value is NaN");
      }
      await FSPawn.Update(pawnId, { [key]: v });
    }
  }
};
</script>

<style scoped></style>
