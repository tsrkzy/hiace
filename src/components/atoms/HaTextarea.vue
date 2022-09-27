<template>
  <label>
    <textarea
      :value="value"
      @input="$emit('input', $event.currentTarget.value)"
      @change="$emit('change', $event.currentTarget.value)"
      @keydown="$emit('keydown', $event)"
      :disabled="disabled"
      :placeholder="placeholder"
      :rows="rows"
      :class="{
        resizeable,
        'full-width': fullWidth,
      }"
    />
  </label>
</template>

<script>
export default {
  name: "HaTextarea",
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    value: { type: String },
    placeholder: { type: String, default: "" },
    disabled: { type: Boolean, default: false },
    rows: { type: String, default: "2" },
    resizeable: { type: Boolean, default: false },
    fullWidth: { type: Boolean, default: false },
  },
};
</script>

<style lang="scss" scoped>
textarea {
  resize: none;
  &.resizeable {
    resize: both;
  }
  &.full-width {
    width: 100%;
  }
}
</style>
