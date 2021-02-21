<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <create-character-form></create-character-form>
    <h5>自分のキャラクタ</h5>
    <CharacterListChip
      :key="c.id"
      v-for="c in categolizedCharacters.own"
      :character-id="c.id"
    />
    <h5>自分の控室</h5>
    <CharacterListChip
      :key="c.id"
      v-for="c in categolizedCharacters.ownArchived"
      :character-id="c.id"
    />
    <h5>その他</h5>
    <CharacterListChip
      :key="c.id"
      v-for="c in categolizedCharacters.others"
      :character-id="c.id"
    />
  </div>
</template>

<script>
import { FSCharacter } from "@/collections/Character";
import { FSPawn } from "@/collections/Pawn";
import CharacterListChip from "@/components/organisms/Float/FloatContents/CharacterList/CharacterListChip";
import CreateCharacterForm from "@/components/organisms/Float/FloatContents/CharacterList/CreateCharacterForm";

export default {
  name: "CharacterList",
  components: { CreateCharacterForm, CharacterListChip },
  computed: {
    categolizedCharacters() {
      const result = { own: [], ownArchived: [], others: [] };
      const userId = this.$store.getters["auth/user"].id;
      const characters = this.$store.getters["character/info"];

      for (let i = 0; i < characters.length; i++) {
        const c = characters[i];
        if (c.owner !== userId) {
          result.others.push(c);
        } else if (c.archived) {
          result.ownArchived.push(c);
        } else {
          result.own.push(c);
        }
      }

      result.others.sort((a, b) =>
        a.owner > b.owner ? 1 : a.name > b.name ? 1 : -1
      );
      result.ownArchived.sort((a, b) => (a.name > b.name ? 1 : -1));
      result.own.sort((a, b) => (a.name > b.name ? 1 : -1));
      return result;
    }
  },
  methods: {
    async onClickActivateAlias(characterId, aliasId) {
      await FSCharacter.SetActiveAlias(characterId, aliasId);
    },
    async onClickDeletePawn(pawnId) {
      await FSPawn.Delete(pawnId);
    }
  }
};
</script>
