<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <ha-button @click="onClickCreateMyCharacter">ADD MY CHARACTER</ha-button>
    <ha-select :items="characterItems"></ha-select>
    <ul>
      <li :key="item.id" v-for="item in characters">
        <span>{{ item.character.name }}({{ item.character.id }})</span>
        <ha-button>EDIT</ha-button>
        <ul>
          <li :key="a.id" v-for="a in item.aliases">
            <span>{{ a.name }}({{ a.id }})</span>
            <ha-button @click="onClickActivateAlias(item.character.id, a.id)"
              >ACTIVATE</ha-button
            >
          </li>
        </ul>
        <ul>
          <li :key="p.id" v-for="p in item.pawns">
            <span>{{ p.id }} on ({{ p.transform }}) / {{ p.board }}</span>
          </li>
        </ul>
        <ha-button @click="onClickCreateAliasToCharacter(item.id)"
          >ADD ALIAS(→ OPEN ADD ALIAS WINDOW)
        </ha-button>
      </li>
    </ul>
  </div>
</template>

<script>
import { FSAlias } from "@/collections/Alias";
import { FSCharacter } from "@/collections/Character";
import HaButton from "@/components/atoms/HaButton";
import HaSelect from "@/components/atoms/HaSelect";

export default {
  name: "CharacterList",
  components: { HaSelect, HaButton },
  data() {
    return {
      imageSelect: null
    };
  },
  computed: {
    characters() {
      const characters = this.$store.getters["character/info"];
      const pawns = this.$store.getters["pawn/info"];
      const aliases = this.$store.getters["alias/info"];

      const items = [];
      for (let i = 0; i < characters.length; i++) {
        const c = characters[i];
        const item = {
          id: c.id,
          character: c,
          aliases: [],
          pawns: []
        };

        for (let j = 0; j < aliases.length; j++) {
          const a = aliases[j];
          const { character: characterId } = a;
          if (c.id === characterId) {
            item.aliases.push(a);
          }
        }

        for (let j = 0; j < pawns.length; j++) {
          const p = pawns[j];
          const { character: characterId } = p;
          if (c.id === characterId) {
            item.pawns.push(p);
          }
        }

        items.push(item);
      }
      return items;
    },
    characterItems() {
      const characters = this.$store.getters["character/info"];
      return characters
        .map(c => ({
          value: c.id,
          text: c.name
        }))
        .sort((a, b) => (a.text.toUpperCase() - b.text.toUpperCase() ? 1 : -1));
    }
  },
  methods: {
    async onClickCreateMyCharacter() {
      const { id: userId, name: userName } = this.$store.getters["auth/user"];
      const roomId = this.$store.getters["room/info"].id;
      const { imageSelect } = this;

      const t = Date.now() % 1000;

      const c = {
        owner: userId,
        name: `${userName}_c${t}`,
        roomId,
        imageId: imageSelect
      };
      await FSCharacter.Create(c);
    },
    async onClickCreateAliasToCharacter(characterId) {
      console.log("DebugIndicator.onClickCreateAliasToCharacter", characterId); // @DELETEME
      const character = this.$store.getters["character/info"].find(
        c => c.id === characterId
      );

      const roomId = this.$store.getters["room/info"].id;
      const imageId = this.imageSelect;
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
    async onClickActivateAlias(characterId, aliasId) {
      await FSCharacter.SetActiveAlias(characterId, aliasId);
    }
  }
};
</script>

<style scoped></style>
