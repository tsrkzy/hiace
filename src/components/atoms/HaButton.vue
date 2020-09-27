<template>
  <button :disabled="disabled" @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "HaButton",
  props: {
    disabled: { type: Boolean, default: false }
  }
};
</script>

<style scoped></style>
