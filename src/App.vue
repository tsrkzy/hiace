<template>
  <div id="app">
    <router-view />
    <smoke></smoke>
  </div>
</template>
<script>
import Smoke from "@/components/organisms/Smoke";
export default {
  components: { Smoke }
};
</script>
<style></style>
