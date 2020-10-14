<template>
  <div>
    <image-show-case v-model="imageId"></image-show-case>
    <ha-button :disabled="!imageId" @click="onClickCreateMyCharacter"
      >ADD MY CHARACTER</ha-button
    >
    <ha-button :disabled="!imageId" @click="onClickCreateAliasToCharacter"
      >ADD CHARACTER'S ALIAS
    </ha-button>
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
import HaButton from "@/components/atoms/HaButton";
import HaSelect from "@/components/atoms/HaSelect";
import { CHARACTER_NOT_SELECTED, FSCharacter } from "@/collections/Character";
import { ALIAS_NOT_SELECTED, FSAlias } from "@/collections/Alias";
import ImageShowCase from "@/components/molecules/ImageShowCase";

export default {
  name: "CharacterSwitcher",
  components: { ImageShowCase, HaButton, HaSelect },
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
    },
    async onClickCreateAliasToCharacter() {
      const { characterId } = this;
      if (characterId === CHARACTER_NOT_SELECTED) {
        console.warn("character not selected yet"); // @DELETEME
        return false;
      }

      const character = this.characters[characterId];

      const roomId = this.$store.getters["room/info"].id;
      const imageId = this.imageId;
      const t = Date.now() % 1000;
      const name = `${character.name}_a${t}`;
      const position = 1;
      const a = {
        roomId,
        characterId,
        imageId,
        name,
        position
      };

      await FSAlias.Create(a);
    },
    async onClickCreateMyCharacter() {
      const { id: userId, name: userName } = this.$store.getters["auth/user"];
      const roomId = this.$store.getters["room/info"].id;
      const { imageId } = this;

      const t = Date.now() % 1000;

      const c = {
        owner: userId,
        name: `${userName}_c${t}`,
        roomId,
        imageId
      };
      await FSCharacter.Create(c);
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
