<template>
  <div>
    <ha-select label="Character" :items="characterItems"
               v-model="activeCharacterId"
               @change="onChangeCharacterHandler"
    >
      <option selected :value="CHARACTER_NOT_SELECTED">{{ userName }}</option>
    </ha-select>
  </div>
</template>

<script>
import HaSelect from "@/components/atoms/HaSelect";
import { CHARACTER_NOT_SELECTED } from "@/collections/Character";

export default {
  name: "CharacterSwitcher",
  components: { HaSelect },
  computed: {
    characterItems() {
      return this.$store.getters["character/info"].map(c => ({ value: c.id, text: c.name }));
    },
    userName() {
      return this.$store.getters["auth/user"].name;
    }
  },
  methods: {
    async onChangeCharacterHandler() {
      const { activeCharacterId: characterId } = this;
      await this.$store.dispatch("character/select", { characterId });
    }
  },
  data() {
    return {
      CHARACTER_NOT_SELECTED,
      activeCharacterId: CHARACTER_NOT_SELECTED,
    };
  },
};
</script>

<style scoped>

</style>