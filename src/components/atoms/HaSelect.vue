<template>
  <label>
    <slot name="label">
      <span v-if="label">{{ label }}</span>
    </slot>
    <select
      :value="value"
      :disabled="disabled"
      @change="$emit('change', $event.currentTarget.value)"
    >
      <slot>
        <option :disabled="mandatory" selected :value="null"
          >選択してください</option
        >
      </slot>
      <option
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        :selected="item.value === value"
        >{{ item.text }}
      </option>
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
    value: { type: String },
    disabled: { type: Boolean, default: false },
    mandatory: { type: Boolean, default: false }
  }
};
</script>

<style scoped></style>
