<template>
  <div id="app">
    <google-authorizer></google-authorizer>
    <router-view/>
  </div>
</template>
<script>



import GoogleAuthorizer from "@/components/molecules/GoogleAuthorizer";
export default {
  components: { GoogleAuthorizer }
};
</script>
<style>
</style>
