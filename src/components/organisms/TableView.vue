<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    <ha-button @click="onClickDeleteTable">DELETE: {{ tableId }}</ha-button>
    <ha-button v-if="table" @click="onClickAddColumn">ADD INT COLUMN</ha-button>
    <ha-button v-if="table" @click="onClickAddColumn">ADD STR COLUMN</ha-button>
    <ha-button v-if="table" @click="onClickAddColumn"
      >ADD BOOL COLUMN</ha-button
    >
    <table v-if="table">
      <thead>
        <tr>
          <th v-for="c in table.columns" :key="c.id">
            {{ c.id }}:{{ c.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(character, i) in table.characters" :key="i">
          <td v-for="(r, j) in character" :key="j">
            <label>
              <input :type="r.inputType" :value="r.value" />
            </label>
          </td>
        </tr>
      </tbody>
    </table>
    <ha-button
      v-for="c in table.columns.filter(cc => !cc.id.startsWith('system'))"
      :key="c.id"
      @click="onClickDeleteColumn"
      >DROP COLUMN: {{ c.id }}:{{ c.label }}
    </ha-button>
  </div>
</template>
<script>
import { FSColumn } from "@/collections/Column";
import { FSTable } from "@/collections/Table";
import HaButton from "@/components/atoms/HaButton";

export default {
  name: "table-view",
  components: { HaButton },
  props: {
    tableId: { type: String, require: true }
  },
  methods: {
    async onClickDeleteTable(tableId) {
      await FSTable.Delete(tableId);
    },
    async onClickAddColumn(tableId, dataType) {
      const roomId = this.room.id;
      await FSColumn.Create({
        roomId,
        tableId,
        dataType,
        refPath: null,
        dataMap: {}
      });
    },
    async onClickDeleteColumn(columnId) {
      await FSColumn.Delete(columnId);
    }
  },
  computed: {
    room() {
      return this.$store.getters["room/info"];
    },
    table() {
      const matrixList = this.$store.getters["table/matrixList"];
      return matrixList.find(t => t.id === this.tableId);
    }
  }
};
</script>
