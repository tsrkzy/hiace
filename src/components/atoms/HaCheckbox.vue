<template>
  <label>
    <span v-if="frontLabel" :style="style">{{ label }}</span>
    <input
      type="checkbox"
      :value="value"
      :checked="value"
      :disabled="disabled"
      @input="$emit('input', $event.currentTarget.checked)"
      @change="$emit('change', $event.currentTarget.checked)"
    />
    <span v-if="!frontLabel" :style="style">{{ label }}</span>
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
    label: { type: String, default: "" },
    frontLabel: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  computed: {
    style() {
      const style = {};
      if (this.disabled) {
        style.color = "lightgray";
      }
      return style;
    }
  }
};
</script>

<style scoped></style>
