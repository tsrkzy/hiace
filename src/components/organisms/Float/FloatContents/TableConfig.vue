<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div v-if="tableMatrix">
    <details>
      <summary>テーブル設定</summary>
      <ha-input-form :value="tableName" @change="onTableName"></ha-input-form>
      <fieldset>
        <legend>列の追加</legend>
        <ha-button v-if="tableId" @click="onAddColumn('int')">数値</ha-button>
        <ha-button v-if="tableId" @click="onAddColumn('str')">文字</ha-button>
        <ha-button v-if="tableId" @click="onAddColumn('bool')">真偽</ha-button>
      </fieldset>
      <fieldset>
        <legend>列設定</legend>
        <ol>
          <li v-for="(c, i) in togglableColumns" :key="c.id">
            <ha-checkbox
              :value="c.show"
              @change="onChangeColumnShow(c.id, $event)"
            ></ha-checkbox>
            <ha-button @click="onDeleteColumn(c.id)">削除</ha-button>
            <ha-button :disabled="i === 0" @click="onChangeOrder(c.id, -1)"
              >↑</ha-button
            >
            <ha-button
              :disabled="i === togglableColumns.length - 1"
              @click="onChangeOrder(c.id, +1)"
              >↓</ha-button
            >
            <span>{{ c.label }}</span>
          </li>
        </ol>
      </fieldset>
    </details>
  </div>
</template>
<script>
import { FSColumn, REF } from "@/collections/Column";
import { FSTable } from "@/collections/Table";
import HaButton from "@/components/atoms/HaButton";
import HaCheckbox from "@/components/atoms/HaCheckbox";
import HaInputForm from "@/components/atoms/HaInputForm";

export default {
  name: "TableConfig",
  components: { HaCheckbox, HaButton, HaInputForm },
  props: {
    tableId: { type: String, require: true }
  },
  computed: {
    tableMatrix() {
      const { tableId } = this;
      if (!tableId) {
        return null;
      }
      const matrixList = this.$store.getters["table/matrixList"];
      return matrixList.find(t => t.id === tableId);
    },
    tableName() {
      return this.$store.getters["table/info"].find(t => t.id === this.tableId)
        ?.name;
    },
    togglableColumns() {
      return this.allColumns.filter(c => !c.system);
    },
    allColumns() {
      return this.tableMatrix?.columns ?? [];
    },
    room() {
      return this.$store.getters["room/info"];
    }
  },
  methods: {
    async onTableName(name) {
      console.log("TableView.onTableName", name); // @DELETEME
      const tableId = this.tableId;
      await this.$nextTick();
      await FSTable.Update(tableId, { name });
    },
    async onAddColumn(dataType) {
      const roomId = this.room.id;
      await FSColumn.Create({
        roomId,
        tableId: this.tableId,
        label: dataType,
        dataType,
        refPath: dataType === REF ? "character.id" : null,
        dataMap: {}
      });
    },
    async onChangeColumnShow(columnId, show = false) {
      console.log("TableView.onChangeColumnShow", columnId, show); // @DELETEME
      await FSColumn.Update(columnId, { show });
    },
    async onChangeOrder(columnId, order) {
      await FSColumn.Reorder(this.tableId, columnId, order);
    },
    async onDeleteColumn(columnId) {
      await FSColumn.Delete(columnId);
    }
  }
};
</script>