<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%; height: 100%; overflow-y: scroll">
    <ha-button v-if="false" @click="onClickAddBoard">ボードを追加</ha-button>
    <fieldset v-for="b in boardItems" :key="b.id">
      <legend>ボード: {{ b.id }}</legend>
      <ha-button @click="onClickAddMap(b.id)">マップを追加</ha-button>
      <ha-button @click="onClickAddDice(b.id)">ダイスを追加</ha-button>
      <fieldset v-for="m in b.maps" :key="m.id">
        <legend>マップ: {{ m.id }}{{ m.image ? "" : "(no image)" }}</legend>
        <ha-button @click="onClickMapEdit(m.id)">編集</ha-button>
        <ha-button @click="onClickDeleteMap(m.id)">削除</ha-button>
      </fieldset>
      <fieldset v-for="p in b.pawns.filter((p) => isMine(p.owner))" :key="p.id">
        <legend>コマ: {{ whoIsPawn(p.id) }}({{ whosePawn(p.owner) }})</legend>
        <ha-button @click="onClickResetPawn(p.id)">原点へ戻す</ha-button>
        <ha-button @click="onClickDeletePawn(p.id)">削除</ha-button>
      </fieldset>
    </fieldset>
  </div>
</template>

<script>
import { FSBoard } from "@/collections/Board";
import { FSDice } from "@/collections/Dice";
import { FSMap } from "@/collections/Map";
import { FSPawn } from "@/collections/Pawn";
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import { MAP_EDIT } from "@/interfaces/IFFloat";

export default {
  name: "BoardList",
  components: { HaButton },
  computed: {
    boardItems() {
      return this.$store.getters["board/divisions"];
    },
  },
  methods: {
    whoIsPawn(pawnId) {
      return FSPawn.Who(pawnId);
    },
    whosePawn(ownerId) {
      return FSUser.Who(ownerId);
    },
    isMine(ownerId) {
      const userId = this.$store.getters["auth/user"].id;
      return ownerId === userId;
    },
    async onClickAddBoard() {
      const userId = this.$store.getters["auth/user"].id;
      const roomId = this.$store.getters["room/info"].id;
      await FSBoard.Create({ userId, roomId });
    },
    async onClickDeleteBoard(boardId) {
      await FSBoard.Delete(boardId);
    },
    async onClickAddMap(boardId) {
      const userId = this.$store.getters["auth/user"].id;
      const roomId = this.$store.getters["room/info"].id;
      const imageId = null;
      await FSMap.Create({ userId, roomId, boardId, imageId });
    },
    async onClickAddDice(boardId) {
      const roomId = this.$store.getters["room/info"].id;
      const userId = this.$store.getters["auth/user"].id;
      await FSDice.Create({ boardId, roomId, userId });
    },
    async onClickDeleteMap(mapId) {
      await FSMap.Delete(mapId);
    },
    async onClickMapEdit(mapId) {
      console.log("BoardList.onClickMapEdit", mapId); // @DELETEME
      const contentId = MAP_EDIT;
      const show = true;
      const args = { mapId };
      await this.$store.dispatch("float/create", { contentId, show, args });
    },
    async onClickResetPawn(pawnId) {
      await FSPawn.ResetTransform([pawnId]);
    },
    async onClickDeletePawn(pawnId) {
      await FSPawn.Delete(pawnId);
    },
  },
};
</script>

<style scoped lang="scss"></style>
