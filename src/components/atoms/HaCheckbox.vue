<template>
  <label>
    <input
      type="checkbox"
      :value="value"
      :checked="value"
      @input="$emit('input', $event.currentTarget.checked)"
      @change="$emit('change', $event.currentTarget.checked)"
    />
    <span>{{ label }}</span>
  </label>
</template>

<script>
export default {
  name: "HaCheckbox",
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: { type: Boolean, default: false },
    label: { type: String, default: "" }
  }
};
</script>

<style scoped></style>
