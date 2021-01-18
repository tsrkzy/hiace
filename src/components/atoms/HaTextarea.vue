<template>
  <label>
    <textarea
      :value="value"
      @input="$emit('input', $event.currentTarget.value)"
      @change="$emit('change', $event.currentTarget.value)"
      @keydown="$emit('keydown', $event)"
      :placeholder="placeholder"
      :rows="rows"
      :class="{
        resizeable
      }"
    />
  </label>
</template>

<script>
export default {
  name: "HaTextarea",
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    value: { type: String },
    placeholder: { type: String, default: "" },
    rows: { type: String, default: "2" },
    resizeable: { type: Boolean, default: false }
  }
};
</script>

<style lang="scss" scoped>
textarea {
  resize: none;
  &.resizeable {
    resize: both;
  }
}
</style>
