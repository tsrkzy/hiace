<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    <ul>
      <li v-for="c in characterItems" :key="c.id">
        <span>{{ c.name }}</span
        ><ha-button>edit</ha-button>
      </li>
    </ul>
  </div>
</template>

<script>
import HaButton from "@/components/atoms/HaButton";
export default {
  name: "CharacterList",
  components: { HaButton },
  computed: {
    characterItems() {
      return this.$store.getters["character/info"].map(c => ({
        id: c.id,
        name: c.name
      }));
    }
  }
};
</script>

<style scoped></style>
