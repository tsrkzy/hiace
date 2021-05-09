<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    <span v-if="deletable">
      <ha-button @click="onClickDeleteCharacter">削除</ha-button>
    </span>
    <span v-if="!deletable">
      <ha-button @click="onClickEditCharacter">編集</ha-button>
      <ha-button @click="onDuplicateCharacter">複製</ha-button>
      <ha-button v-if="hasAlias" @click="onClickAddPawn">コマ追加</ha-button>
      <ha-button v-else disabled>立ち絵なし</ha-button>
      <ha-button v-if="own && archived" @click="onArchiveTo(false)"
        >控室から出す</ha-button
      >
      <ha-button v-if="own && !archived" @click="onArchiveTo(true)"
        >控室に入れる</ha-button
      >
    </span>
    <span>{{ `${characterName}${own ? "" : `(${owner})`}` || "ERROR" }}</span>
  </div>
</template>
<script>
import { FSCharacter } from "@/collections/Character";
import { FSPawn } from "@/collections/Pawn";
import HaButton from "@/components/atoms/HaButton";
import HaSelect from "@/components/atoms/HaSelect";
import { CHARACTER_EDIT } from "@/interfaces/IFFloat";
import { getName } from "@/scripts/helper";

export default {
  name: "CharacterListChip",
  components: { HaButton },
  props: {
    characterId: { type: String, require: true },
    deletable: { type: Boolean, default: false }
  },
  computed: {
    character() {
      const characterId = this.characterId;
      return this.$store.getters["character/info"].find(
        c => c.id === characterId
      );
    },
    characterName() {
      return this.character?.name;
    },
    activeAlias() {
      return this.character?.activeAlias;
    },
    archived() {
      return !!this.character?.archived;
    },
    owner() {
      return getName("user", this.character?.owner);
    },
    aliases() {
      return this.$store.getters["alias/info"].filter(
        a => a.character === this.characterId
      );
    },
    hasAlias() {
      const active = this.aliases.find(a => a.id === this.activeAlias);
      return !!active?.image;
    },
    own() {
      const owner = this.character?.owner;
      const myUserId = this.$store.getters["auth/user"].id;
      return owner === myUserId;
    }
  },
  methods: {
    async onClickDeleteCharacter() {
      const { characterId } = this;
      await FSCharacter.Delete(characterId);
    },
    async onClickEditCharacter() {
      const contentId = CHARACTER_EDIT;
      const show = true;
      const args = { characterId: this.characterId };
      await this.$store.dispatch("float/create", { contentId, show, args });
    },
    async onDuplicateCharacter() {
      const { characterId } = this;
      await FSCharacter.Duplicate(characterId);
    },
    async onClickAddPawn() {
      console.log("CharacterList.onClickAddPawn"); // @DELETEME
      const { characterId } = this;
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
    async onArchiveTo(archived) {
      await FSCharacter.Update(this.characterId, { archived: !!archived });
    }
  }
};
</script>
