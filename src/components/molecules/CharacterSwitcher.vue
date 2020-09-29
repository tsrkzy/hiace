<template>
  <div>
    <ha-select
      label="Character"
      :items="characterItems"
      v-model="activeCharacterId"
      @change="onChangeCharacterHandler"
    >
      <option selected :value="CHARACTER_NOT_SELECTED"
        >{{ userName }}(PL)
      </option>
    </ha-select>
    <ha-select
      label="Alias"
      :items="aliasItems"
      v-model="activeAliasId"
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
      return this.$store.getters["character/mine"].map(c => ({
        value: c.id,
        text: c.name
      }));
    },
    aliasItems() {
      const { activeCharacterId } = this;
      console.log("CharacterSwitcher.aliasItems", activeCharacterId); // @DELETEME
      if (activeCharacterId === CHARACTER_NOT_SELECTED) {
        return [];
      }

      const characters = this.$store.getters["character/tree"];
      const character = characters[activeCharacterId];
      const { aliases = {} } = character;
      return Object.entries(aliases).map(([id, a]) => {
        return { value: id, text: a.name };
      });
    },
    userName() {
      return this.$store.getters["auth/user"].name;
    }
  },
  methods: {
    async onChangeCharacterHandler() {
      const { activeCharacterId: characterId } = this;
      await this.$store.dispatch("character/select", { characterId });

      await this.$nextTick();
      if (characterId === CHARACTER_NOT_SELECTED) {
        this.activeAliasId = null;
        return false;
      }

      const character = this.$store.getters["character/mine"].find(
        c => c.id === characterId
      );
      const { activeAlias } = character;
      console.log("activeAlias", activeAlias); // @DELETEME
      this.activeAliasId = activeAlias;
    },
    async onChangeAliasHandler() {
      const { activeCharacterId: characterId, activeAliasId: aliasId } = this;
      if (characterId === CHARACTER_NOT_SELECTED) {
        return false;
      }
      const character = this.$store.getters["character/mine"].find(
        c => c.id === characterId
      );

      await FSCharacter.SetActiveAlias(characterId, aliasId);
    }
  },
  data() {
    return {
      CHARACTER_NOT_SELECTED,
      ALIAS_NOT_SELECTED,
      activeCharacterId: CHARACTER_NOT_SELECTED,
      activeAliasId: ALIAS_NOT_SELECTED
    };
  }
};
</script>

<style scoped></style>
