<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <ha-input-form
      v-model="characterName"
      placeholder="キャラクタ名"
    ></ha-input-form>
    <ha-button @click="onClickCreateMyCharacter(false)"
      >キャラクタ追加</ha-button
    >
    <ha-button @click="onClickCreateMyCharacter(true)">控室に追加</ha-button>
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
import HaButton from "@/components/atoms/HaButton";
import HaInputForm from "@/components/atoms/HaInputForm";
import CharacterListChip from "@/components/organisms/Float/FloatContents/CharacterList/CharacterListChip";
import { Smoke } from "@/scripts/Smoke";

export default {
  name: "CharacterList",
  components: { CharacterListChip, HaInputForm, HaButton },
  data() {
    return {
      characterName: ""
    };
  },
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

      result.others.sort((a, b) => (a.owner > b.owner ? 1 : -1));
      return result;
    }
  },
  methods: {
    async onClickCreateMyCharacter(archived) {
      const characterName = this.characterName;
      const { id: userId, name: userName } = this.$store.getters["auth/user"];
      const roomId = this.$store.getters["room/info"].id;

      const t = Date.now() % 1000;

      const c = {
        owner: userId,
        name: characterName ?? `${userName}_c${t}`,
        roomId,
        imageId: null,
        archived
      };
      await Smoke.on();
      await FSCharacter.Create(c);
      await Smoke.off();
      this.characterName = "";
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
