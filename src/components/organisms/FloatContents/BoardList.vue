<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <ul>
      <li v-for="b in boardItems" :key="b.id">
        <span>Board: {{ b.id }}</span>
        <ol>
          <li v-for="m in b.maps" :key="m.id">Map: {{ m.id }}</li>
        </ol>
        <ol>
          <li v-for="p in b.pawns" :key="p.id">Pawn: {{ p.id }}</li>
        </ol>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "BoardList",
  computed: {
    boardItems() {
      return this.$store.getters["board/divisions"];
    }
  }
};
</script>

<style scoped lang="scss">
li {
  list-style: none;
}
</style>
