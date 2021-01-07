<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
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
  },
  methods: {
    async onClickDeletePawn(pawnId) {
      await FSPawn.Delete(pawnId);
    }
  }
};
</script>

<style scoped></style>
