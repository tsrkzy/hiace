<template>
  <label>
    <slot name="label">
      <span v-if="label">{{ label }}</span>
    </slot>
    <select @change="$emit('change', $event.currentTarget.value)">
      <option v-for="item in items" :key="item.value" :value="item.value">{{ item.text }}</option>
    </select>
  </label>
</template>

<script>
export default {
  name: "HaSelect",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    label: { type: String },
    items: { type: Array, default: () => [] },
    value: { type: String }
  }
};
</script>

<style scoped>

</style>