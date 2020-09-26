<template>
  <label>
    <slot name="label">
      <span v-if="label">{{ label }}</span>
    </slot>
    <select @change="$emit('change', $event.currentTarget.value)">
      <option selected :value="SYSTEM_CHANNEL_ID">全体</option>
      <option v-for="item in items" :key="item.value" :value="item.value">{{ item.text }}</option>
    </select>
  </label>
</template>

<script>
import { SYSTEM_CHANNEL_ID } from "@/collections/Channel";

export default {
  name: "HaSelect",
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    label: { type: String },
    items: { type: Array, default: () => [] },
    value: { type: String, default: SYSTEM_CHANNEL_ID }
  },
  data(){
    return {SYSTEM_CHANNEL_ID}
  }
};
</script>

<style scoped>

</style>