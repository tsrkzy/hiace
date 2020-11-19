<template>
  <div id="app">
    <router-view />
    <context-menu></context-menu>
    <smoke></smoke>
  </div>
</template>
<script>
import ContextMenu from "@/components/organisms/ContextMenu";
import Smoke from "@/components/organisms/Smoke";
export default {
  components: { ContextMenu, Smoke }
};
</script>
<style></style>
