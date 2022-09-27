<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%; height: 100%; overflow-y: scroll">
    <create-character-form></create-character-form>
    <ha-checkbox
      label="キャラクタを完全に削除する"
      v-model="deleteMode"
    ></ha-checkbox>
    <container>
      <column cols="2"><h5>自分のキャラクタ</h5></column>
      <column
        cols="1"
        class="text--force_clip"
        :key="c.id"
        v-for="c in categolizedCharacters.own"
      >
        <CharacterListChip :character-id="c.id" :deletable="deleteMode" />
      </column>
      <column cols="2"><h5>自分の控室</h5></column>
      <column
        cols="1"
        class="text--force_clip"
        :key="c.id"
        v-for="c in categolizedCharacters.ownArchived"
      >
        <CharacterListChip :character-id="c.id" :deletable="deleteMode" />
      </column>
      <column cols="2"><h5>その他</h5></column>
      <column
        cols="1"
        class="text--force_clip"
        :key="c.id"
        v-for="c in categolizedCharacters.others"
      >
        <CharacterListChip :character-id="c.id" />
      </column>
    </container>
  </div>
</template>

<script>
import { FSCharacter } from "@/collections/Character";
import { FSPawn } from "@/collections/Pawn";
import Column from "@/components/atoms/flex/Column";
import Container from "@/components/atoms/flex/Container";
import HaCheckbox from "@/components/atoms/HaCheckbox";
import CharacterListChip from "@/components/organisms/Float/FloatContents/CharacterList/CharacterListChip";
import CreateCharacterForm from "@/components/organisms/Float/FloatContents/CharacterList/CreateCharacterForm";

export default {
  name: "CharacterList",
  components: {
    HaCheckbox,
    Column,
    Container,
    CreateCharacterForm,
    CharacterListChip,
  },
  data() {
    return {
      deleteMode: false,
    };
  },
  computed: {
    categolizedCharacters() {
      const result = {
        own: [],
        ownArchived: [],
        others: [],
        othersArchived: [],
      };
      const userId = this.$store.getters["auth/user"].id;
      const characters = this.$store.getters["character/info"];

      for (let i = 0; i < characters.length; i++) {
        const c = characters[i];
        if (c.owner !== userId) {
          if (c.archived) {
            result.othersArchived.push(c);
          } else {
            result.others.push(c);
          }
        } else if (c.archived) {
          result.ownArchived.push(c);
        } else {
          result.own.push(c);
        }
      }

      result.others.sort((a, b) => {
        if (a.owner > b.owner) return 1;
        if (a.owner < b.owner) return -1;
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
      result.ownArchived.sort((a, b) => (a.name > b.name ? 1 : -1));
      result.own.sort((a, b) => (a.name > b.name ? 1 : -1));
      return result;
    },
  },
  methods: {
    async onClickActivateAlias(characterId, aliasId) {
      await FSCharacter.SetActiveAlias(characterId, aliasId);
    },
    async onClickDeletePawn(pawnId) {
      await FSPawn.Delete(pawnId);
    },
  },
};
</script>
<style scoped lang="scss"></style>
