<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <ha-button @click="onClickAddBoard">ボードを追加</ha-button>
    <ul>
      <li v-for="b in boardItems" :key="b.id">
        <span>ボード: {{ b.id }}</span>
        <ha-button @click="onClickDeleteBoard(b.id)">削除</ha-button>
        <ha-button @click="onClickAddMap(b.id)">マップの追加</ha-button>
        <ul>
          <li v-for="m in b.maps" :key="m.id">
            <span>マップ: {{ m.id }}{{ m.image ? "" : "(no image)" }}</span>
            <ha-checkbox label="座標をロック"></ha-checkbox>
            <ha-button @click="onClickMapEdit(m.id)">編集</ha-button>
            <ha-button @click="onClickDeleteMap(m.id)">削除</ha-button>
          </li>
        </ul>
        <ol>
          <li v-for="p in b.pawns" :key="p.id">
            <span>コマ: {{ whoIsPawn(p.id) }}({{ whosePawn(p.owner) }})</span>
            <ha-button @click="onClickDeletePawn(p.id)">削除</ha-button>
          </li>
        </ol>
      </li>
    </ul>
  </div>
</template>

<script>
import { FSBoard } from "@/collections/Board";
import { FSMap } from "@/collections/Map";
import { FSPawn } from "@/collections/Pawn";
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import HaCheckbox from "@/components/atoms/HaCheckbox";

export default {
  name: "BoardList",
  components: { HaCheckbox, HaButton },
  computed: {
    boardItems() {
      return this.$store.getters["board/divisions"];
    }
  },
  methods: {
    whoIsPawn(pawnId) {
      return FSPawn.Who(pawnId);
    },
    whosePawn(ownerId) {
      return FSUser.Who(ownerId);
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
    async onClickDeleteMap(mapId) {
      await FSMap.Delete(mapId);
    },
    async onClickMapEdit(mapId) {
      console.log("BoardList.onClickMapEdit", mapId); // @DELETEME
    },
    async onClickDeletePawn(pawnId) {
      await FSPawn.Delete(pawnId);
    }
  }
};
</script>

<style scoped lang="scss"></style>
