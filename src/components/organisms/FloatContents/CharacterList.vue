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
    <ul>
      <li :key="item.id" v-for="item in characters">
        <span>{{ item.character.name }}</span>
        <ha-button @click="onClickEditCharacter(item.character.id)"
          >キャラクタ編集
        </ha-button>
        <ha-button @click="onClickDeleteCharacter(item.character.id)"
          >キャラクタ削除
        </ha-button>
        <ha-button @click="onClickCreateAliasToCharacter(item.id)"
          >立ち絵を追加する
        </ha-button>
        <ha-button @click="onClickAddPawn(item.character.id)"
          >コマ追加
        </ha-button>
        <ul>
          <li :key="a.id" v-for="a in item.aliases">
            <span
              >{{ a.id === item.character.activeAlias ? "*" : "" }}:
              {{ a.name }}</span
            >
            <ha-button
              v-if="a.id !== item.character.activeAlias"
              @click="onClickActivateAlias(item.character.id, a.id)"
              >この立ち絵を使う
            </ha-button>
          </li>
        </ul>
        <ul>
          <li :key="p.id" v-for="p in item.pawns">
            <ha-button @click="onClickDeletePawn(p.id)"
              >コマを削除する
            </ha-button>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { FSAlias } from "@/collections/Alias";
import { FSCharacter } from "@/collections/Character";
import { FSPawn } from "@/collections/Pawn";
import HaButton from "@/components/atoms/HaButton";
import HaInputForm from "@/components/atoms/HaInputForm";
import { CHARACTER_EDIT } from "@/interfaces/IFFloat";

export default {
  name: "CharacterList",
  components: { HaInputForm, HaButton },
  data() {
    return {
      characterName: ""
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
    async onClickEditCharacter(characterId) {
      const contentId = CHARACTER_EDIT;
      const show = true;
      const args = { characterId };
      await this.$store.dispatch("float/create", { contentId, show, args });
    },
    async onClickDeleteCharacter(characterId) {
      await FSCharacter.Delete(characterId);
    },
    async onClickAddPawn(characterId) {
      console.log("CharacterList.onClickAddPawn", characterId); // @DELETEME
      const userId = this.$store.getters["auth/user"].id;
      const roomId = this.$store.getters["room/info"].id;
      const boardId = this.$store.getters["room/activeBoard"];
      const { activeAlias } = this.$store.getters["character/info"].find(
        c => c.id === characterId
      );
      const { image } = this.$store.getters["alias/info"].find(
        a => a.id === activeAlias
      );
      await FSPawn.Create({
        userId,
        roomId,
        boardId,
        imageId: image,
        characterId
      });
    },
    async onClickCreateAliasToCharacter(characterId) {
      console.log("DebugIndicator.onClickCreateAliasToCharacter", characterId); // @DELETEME
      const character = this.$store.getters["character/info"].find(
        c => c.id === characterId
      );

      const roomId = this.$store.getters["room/info"].id;
      const t = Date.now() % 1000;
      const name = `${character.name}_a${t}`;
      const position = 1;
      const a = {
        roomId,
        characterId,
        imageId: null,
        name,
        position
      };

      await FSAlias.Create(a);
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

<style scoped></style>
