<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <ul>
    <li v-for="c of characterItems" :key="c.id">
      <span>{{ c.id }}</span>
      <ha-button @click="onClickSelectCharacter(c.id)"
        >{{ c.id === characterId ? "*" : "" }}CHOOSE</ha-button
      >
      <!--    @TODO PAWN FACTORY  -->
    </li>
  </ul>
</template>

<script>
import HaButton from "@/components/atoms/HaButton";

export default {
  name: "CharacterShowCase",
  components: { HaButton },
  props: {
    characterId: { type: String }
  },
  model: {
    prop: "characterId",
    event: "selectCharacter"
  },
  methods: {
    onClickSelectCharacter(characterId) {
      this.$emit("selectCharacter", characterId);
    }
  },
  computed: {
    characterItems() {
      return this.$store.getters["character/info"].map(c => ({
        id: c.id,
        url: c.url
      }));
    }
  }
};
</script>

<style scoped></style>
