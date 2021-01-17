<template>
  <div id="app">
    <router-view />
    <smoke></smoke>
  </div>
</template>
<script>
import Smoke from "@/components/atoms/Smoke";
export default {
  components: { Smoke }
};
</script>
<style></style>
