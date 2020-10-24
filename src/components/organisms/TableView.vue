<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    <ha-button @click="onClickDeleteTable">DELETE: {{ tableId }}</ha-button>
    <ha-button v-if="table" @click="onClickAddColumn('int')"
      >ADD INT COLUMN
    </ha-button>
    <ha-button v-if="table" @click="onClickAddColumn('str')"
      >ADD STR COLUMN
    </ha-button>
    <ha-button v-if="table" @click="onClickAddColumn('ref')"
      >ADD REF COLUMN
    </ha-button>
    <ha-button v-if="table" @click="onClickAddColumn('bool')"
      >ADD BOOL COLUMN
    </ha-button>
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
          <td v-for="(cell, j) in character" :key="j">
            <label>
              <input
                v-if="cell.dataType === 'int'"
                type="number"
                :value="cell.value"
                :disabled="cell.columnId.startsWith('system')"
                @change="onInputCell($event, cell)"
              />
              <input
                v-else-if="cell.dataType === 'bool'"
                type="checkbox"
                :checked="cell.value"
                :disabled="cell.columnId.startsWith('system')"
                @change="onInputCell($event, cell)"
              />
              <input
                v-else
                type="text"
                :value="cell.value"
                :disabled="cell.columnId.startsWith('system')"
                @change="onInputCell($event, cell)"
              />
            </label>
          </td>
        </tr>
      </tbody>
    </table>
    <ha-button
      v-for="c in table.columns.filter(cc => !cc.id.startsWith('system'))"
      :key="c.id"
      @click="onClickDeleteColumn(c.id)"
      >DROP COLUMN: {{ c.id }}:{{ c.label }}
    </ha-button>
  </div>
</template>
<script>
import { BOOL, FSColumn, INT, REF, STR } from "@/collections/Column";
import { FSTable } from "@/collections/Table";
import HaButton from "@/components/atoms/HaButton";

export default {
  name: "table-view",
  components: { HaButton },
  props: {
    tableId: { type: String, require: true }
  },
  methods: {
    async onClickDeleteTable() {
      await FSTable.Delete(this.tableId);
    },
    async onClickAddColumn(dataType) {
      const roomId = this.room.id;
      await FSColumn.Create({
        roomId,
        tableId: this.tableId,
        dataType,
        refPath: dataType === REF ? "character.id" : null,
        dataMap: {}
      });
    },
    async onClickDeleteColumn(columnId) {
      await FSColumn.Delete(columnId);
    },
    async onInputCell(e, cell) {
      const { columnId, characterId, dataType, refPath } = cell;
      try {
        /* データ型変換 */
        const inputValue = e.currentTarget.value;

        if (refPath) {
          throw new Error(`cannot modify cell w/refPath: ${refPath}`);
        }

        let value;
        if (dataType === INT) {
          value = parseInt(inputValue, 10);
          if (Number.isNaN(value)) {
            throw new Error(`${inputValue} is not a number`);
          }
        }

        if (dataType === STR) {
          value = inputValue;
        }

        if (dataType === BOOL) {
          value = e.currentTarget.checked;
        }

        // dataMap のkey:characterId な valueを変更
        await FSColumn.UpdateDataMap(columnId, [
          {
            characterId,
            value
          }
        ]);
      } catch (error) {
        /* ロールバック */
        e.currentTarget.value = cell.value;

        console.error(error);
      }
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
