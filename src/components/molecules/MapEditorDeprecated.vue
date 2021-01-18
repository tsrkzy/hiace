<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    <img :src="imageUrl" :alt="mapId" :width="24" :height="24" />
    <ha-button @click="onClickDeleteMap(mapId)"
      >DELETE MAP: {{ mapId }}
    </ha-button>
  </div>
</template>

<script>
import { FSImage } from "@/collections/Image";
import { FSMap } from "@/collections/Map";
import HaButton from "@/components/atoms/HaButton";

export default {
  name: "MapEditor",
  components: { HaButton },
  props: {
    mapId: { type: String, require: true }
  },
  data() {
    return {
      image: null
    };
  },
  async created() {
    if (this.map) {
      console.log("load image"); // @DELETEME
      this.image = await FSImage.GetById({ id: this.map.image });
    } else {
      console.log("load map then load image"); // @DELETEME
      const { image } = await FSMap.GetById({ id: this.mapId });
      this.image = await FSImage.GetById({ id: image });
    }
  },
  computed: {
    map() {
      return this.$store.getters["map/info"].find(m => m.id === this.mapId);
    },
    imageUrl() {
      return this.image ? this.image.url : "";
    }
  },
  methods: {
    async onClickDeleteMap(mapId) {
      await FSMap.Delete(mapId);
    },
    async updateMapShape(mapId, key, value) {
      const v = parseInt(value, 10);
      if (isNaN(v)) {
        throw new Error("value is NaN");
      }
      await FSMap.Update(mapId, { [key]: v });
    }
  }
};
</script>

<style scoped></style>
