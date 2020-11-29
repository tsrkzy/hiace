<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    {{ characterId }}
    <ha-input-form
      label="character.name"
      :value="characterName"
      @change="onCharacterNameInput"
    ></ha-input-form>
  </div>
</template>

<script>
import { FSCharacter } from "@/collections/Character";
import HaInputForm from "@/components/atoms/HaInputForm";
const CHARACTER_NOT_SELECTED = "CHARACTER_NOT_SELECTED";

export default {
  name: "CharacterEdit",
  components: { HaInputForm },
  props: {
    floatId: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      characterId: null
    };
  },
  created() {
    const float = this.$store.getters["float/info"].find(
      f => f.id === this.floatId
    );
    this.characterId = float?.args?.characterId ?? CHARACTER_NOT_SELECTED;
  },
  methods: {
    onCharacterNameInput(value) {
      FSCharacter.Update(this.characterId, { name: value });
    }
  },
  computed: {
    characterName() {
      const character = this.$store.getters["character/info"].find(
        c => c.id === this.characterId
      );
      return character.name;
    }
  }
};
</script>

<style scoped></style>
