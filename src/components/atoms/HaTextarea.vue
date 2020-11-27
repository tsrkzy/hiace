<template>
  <label>
    <textarea
      :value="value"
      @input="$emit('input', $event.currentTarget.value)"
      @keydown="$emit('keydown', $event)"
      :placeholder="placeholder"
      :rows="rows"
      :style="{
        resize: resizeable ? 'both' : 'none'
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
    resizeable: { type: Boolean, default: true }
  }
};
</script>

<style scoped></style>
