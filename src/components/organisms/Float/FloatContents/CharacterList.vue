<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <ha-button @click="onClickCreateMyCharacter">キャラクタ追加</ha-button>
    <ha-input-form
      v-model="characterName"
      placeholder="キャラクタ名"
    ></ha-input-form>
    <CharacterListChip
      :key="characterId"
      v-for="characterId in characterIdList"
      :character-id="characterId"
    />
  </div>
</template>

<script>
import { FSCharacter } from "@/collections/Character";
import { FSPawn } from "@/collections/Pawn";
import HaButton from "@/components/atoms/HaButton";
import HaInputForm from "@/components/atoms/HaInputForm";
import CharacterListChip from "@/components/organisms/Float/FloatContents/CharacterListChip";

export default {
  name: "CharacterList",
  components: { CharacterListChip, HaInputForm, HaButton },
  data() {
    return {
      characterName: ""
    };
  },
  computed: {
    characterIdList() {
      return this.$store.getters["character/info"].map(c => c.id);
    }
  },
  methods: {
    async onClickCreateMyCharacter() {
      const characterName = this.characterName;
      const { id: userId, name: userName } = this.$store.getters["auth/user"];
      const roomId = this.$store.getters["room/info"].id;

      const t = Date.now() % 1000;

      const c = {
        owner: userId,
        name: characterName ?? `${userName}_c${t}`,
        roomId,
        imageId: null
      };
      await FSCharacter.Create(c);
    },
    async onClickActivateAlias(characterId, aliasId) {
      await FSCharacter.SetActiveAlias(characterId, aliasId);
    },
    async onClickDeletePawn(pawnId) {
      await FSPawn.Delete(pawnId);
    }
  }
};
</script>
