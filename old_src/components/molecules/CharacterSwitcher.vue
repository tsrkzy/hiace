<template>
  <div>
    <ha-select
      label="キャラクタ"
      :items="characterItems"
      v-model="characterId"
      @change="onChangeCharacterHandler"
    >
      <option selected :value="CHARACTER_NOT_SELECTED">
        {{ userName }}(PL)
      </option>
    </ha-select>
    <ha-select
      label="立ち絵"
      :disabled="disableAlias"
      :items="aliasItems"
      v-model="aliasId"
      @change="onChangeAliasHandler"
    >
      <option :value="ALIAS_NOT_SELECTED" disabled>alias</option>
    </ha-select>
  </div>
</template>

<script>
import HaSelect from "@/components/atoms/HaSelect";
import { CHARACTER_NOT_SELECTED, FSCharacter } from "@/collections/Character";
import { ALIAS_NOT_SELECTED } from "@/collections/Alias";

export default {
  name: "CharacterSwitcher",
  components: { HaSelect },
  computed: {
    characterItems() {
      return this.$store.getters["character/mine"].map((c) => ({
        value: c.id,
        text: c.name,
      }));
    },
    aliasItems() {
      const { characterId } = this;
      if (characterId === CHARACTER_NOT_SELECTED) {
        return [];
      }

      const aliases = this.$store.getters["alias/info"].filter(
        (a) => a.character === characterId
      );
      return aliases.map((a) => ({
        value: a.id,
        text: a.name,
      }));
    },
    userName() {
      return this.$store.getters["auth/user"].name;
    },
    disableAlias() {
      return (this.aliasItems || []).length === 0;
    },
  },
  methods: {
    /**
     * @return {{aliasId:?String , characterId:?String}}
     */
    getIdCharacterAndAlias() {
      const { characterId, aliasId } = this;

      return {
        characterId:
          characterId === CHARACTER_NOT_SELECTED ? null : characterId,
        aliasId: aliasId === ALIAS_NOT_SELECTED ? null : aliasId,
      };
    },
    async onChangeCharacterHandler() {
      const { characterId } = this;

      if (characterId === CHARACTER_NOT_SELECTED) {
        this.aliasId = null;
        return false;
      }

      const { activeAlias } = this.$store.getters["character/info"].find(
        (c) => c.id === characterId
      );

      this.aliasId = activeAlias;
      this.pushUp();
    },
    async onChangeAliasHandler() {
      const { characterId, aliasId } = this;
      if (characterId === CHARACTER_NOT_SELECTED) {
        return false;
      }

      await FSCharacter.SetActiveAlias(characterId, aliasId);
      this.pushUp();
    },
    pushUp() {
      const characterId = this.characterId;
      const aliasId = this.aliasId;
      this.$emit("changed", { characterId, aliasId });
    },
  },
  data() {
    return {
      CHARACTER_NOT_SELECTED,
      ALIAS_NOT_SELECTED,
      characterId: CHARACTER_NOT_SELECTED,
      imageId: null,
      aliasId: ALIAS_NOT_SELECTED,
    };
  },
};
</script>

<style scoped>
div {
  display: inline;
}
</style>
