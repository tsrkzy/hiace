<template>
  <div>
    <ha-select
      label="Character"
      :items="characterItems"
      v-model="characterId"
      @change="onChangeCharacterHandler"
    >
      <option selected :value="CHARACTER_NOT_SELECTED"
        >{{ userName }}(PL)
      </option>
    </ha-select>
    <ha-select
      label="Alias"
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
    characters() {
      return this.$store.getters["character/tree"];
    },
    characterItems() {
      return this.$store.getters["character/mine"].map(c => ({
        value: c.id,
        text: c.name
      }));
    },
    aliasItems() {
      const { characterId } = this;
      if (characterId === CHARACTER_NOT_SELECTED) {
        return [];
      }

      const character = this.characters[characterId];
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
    /**
     * @return {{aliasId:?String , characterId:?String}}
     */
    getIdCharacterAndAlias() {
      const { characterId, aliasId } = this;

      return {
        characterId:
          characterId === CHARACTER_NOT_SELECTED ? null : characterId,
        aliasId: aliasId === ALIAS_NOT_SELECTED ? null : aliasId
      };
    },
    async onChangeCharacterHandler() {
      const { characterId } = this;

      if (characterId === CHARACTER_NOT_SELECTED) {
        this.aliasId = null;
        return false;
      }

      const character = this.characters[characterId];
      const { activeAlias } = character;

      console.log("activeAlias", activeAlias); // @DELETEME
      this.aliasId = activeAlias;
    },
    async onChangeAliasHandler() {
      const { characterId, aliasId } = this;
      if (characterId === CHARACTER_NOT_SELECTED) {
        return false;
      }

      await FSCharacter.SetActiveAlias(characterId, aliasId);
    }
  },
  data() {
    return {
      CHARACTER_NOT_SELECTED,
      ALIAS_NOT_SELECTED,
      characterId: CHARACTER_NOT_SELECTED,
      imageId: null,
      aliasId: ALIAS_NOT_SELECTED
    };
  }
};
</script>

<style scoped></style>
