<template>
  <label>
    <slot name="label">
      <span v-if="label">{{ label }}</span>
    </slot>
    <input
      :value="value"
      @input="$emit('input', $event.currentTarget.value)"
      @change="$emit('change', $event.currentTarget.value)"
      @keydown="$emit('keydown', $event)"
      :placeholder="placeholder"
      :disabled="disabled"
    />
  </label>
</template>

<script>
export default {
  name: "HaInputForm",
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    label: { type: String },
    value: { type: String },
    disabled: { type: Boolean },
    placeholder: { type: String, default: "" },
  },
};
</script>

<style scoped></style>
