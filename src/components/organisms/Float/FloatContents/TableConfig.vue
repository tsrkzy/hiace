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
            <ha-button
              :disabled="sortConfig === `${c.id}_desc`"
              @click="onChangeSort(c.id, 'desc')"
              >DESC</ha-button
            >
            <ha-button
              :disabled="sortConfig === `${c.id}_asc`"
              @click="onChangeSort(c.id, 'asc')"
              >ASC</ha-button
            >
            <span>{{ c.label }}</span>
          </li>
        </ol>
      </fieldset>
      <ha-checkbox
        v-model="showDeleteButton"
        label="このテーブルを完全に削除する"
      ></ha-checkbox>
      <ha-button v-if="showDeleteButton" @click="onDeleteTable"
        >このテーブルを削除する</ha-button
      >
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
    tableId: { type: String, require: true },
    sortConfig: { type: String }
  },
  model: {
    prop: "sortConfig",
    event: "change"
  },
  data() {
    return {
      showDeleteButton: false
    };
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
      this.emitSort();
      await FSColumn.Update(columnId, { show });
    },
    async onChangeOrder(columnId, order) {
      await FSColumn.Reorder(this.tableId, columnId, order);
    },
    async onDeleteTable() {
      this.emitSort();
      const tableId = this.tableId;
      await FSTable.Delete(tableId);
    },
    async onDeleteColumn(columnId) {
      this.emitSort();
      await FSColumn.Delete(columnId);
    },
    onChangeSort(columnId, order = "asc") {
      this.emitSort(`${columnId}_${order}`);
    },
    emitSort(sortString = null) {
      this.$emit("change", sortString);
    }
  }
};
</script>
