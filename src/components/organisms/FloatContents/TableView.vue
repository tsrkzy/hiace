<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <div>
      <ha-select :items="tableItems" @change="onChangeTable($event)">
        <option :value="null" disabled selected>choose table</option>
      </ha-select>
    </div>
    <div v-if="tableMatrix">
      <details>
        <summary>config</summary>
        <ha-button v-if="tableId" @click="onClickAddColumn('int')"
          >INT
        </ha-button>
        <ha-button v-if="tableId" @click="onClickAddColumn('str')"
          >STR
        </ha-button>
        <ha-button v-if="tableId" @click="onClickAddColumn('ref')"
          >REF
        </ha-button>
        <ha-button v-if="tableId" @click="onClickAddColumn('bool')"
          >BOOL
        </ha-button>
        <ol>
          <li v-for="c in togglableColumns" :key="c.id">
            <ha-checkbox
              :label="c.label"
              :value="c.show"
              @change="onChangeColumnShow(c.id, $event)"
            ></ha-checkbox>
          </li>
        </ol>
      </details>
    </div>
    <div v-if="tableMatrix">
      <table style="width: 100%;">
        <thead>
          <tr>
            <th v-for="c in columns" :key="c.id">
              <label>
                <input
                  type="text"
                  :value="c.label"
                  :disabled="c.system"
                  @change="onInputHeader($event, c)"
                  style="width: calc(100% - 4px);font-weight: bold;"
                />
              </label>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i">
            <td v-for="(cell, j) in filterWithHeader(row.cells)" :key="j">
              <label>
                <input
                  v-if="cell.dataType === 'int'"
                  type="number"
                  :value="cell.value"
                  :disabled="cell.columnId.startsWith('system')"
                  @change="onInputCell($event, cell)"
                  style="width: calc(100% - 4px);"
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
                  style="width: calc(100% - 4px);"
                />
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { BOOL, FSColumn, INT, REF, STR } from "@/collections/Column";
import HaButton from "@/components/atoms/HaButton";
import HaCheckbox from "@/components/atoms/HaCheckbox";
import HaSelect from "@/components/atoms/HaSelect";
import { Notice } from "@/scripts/Notice";

export default {
  name: "TableView",
  components: { HaButton, HaCheckbox, HaSelect },
  props: {
    floatId: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      tableId: null
    };
  },
  methods: {
    onChangeTable(tableId) {
      this.tableId = tableId;
    },
    async onInputCell(e, cell) {
      const { columnId, characterId, dataType, refPath } = cell;
      try {
        /* データ型変換 */
        const inputValue = e.currentTarget.value;

        if (refPath) {
          /* ステータス参照タイプのセルは変更不可 */
          throw new Error(`cannot modify cell w/refPath: ${refPath}`);
        }

        let value;
        if (dataType === INT) {
          value = parseInt(inputValue, 10);
          if (Number.isNaN(value)) {
            throw new Error(`${inputValue} is not a number`);
          }
          if (
            value < Number.MIN_SAFE_INTEGER ||
            Number.MAX_SAFE_INTEGER <= value
          ) {
            throw new Error(`out of number range: ${value}`);
          }
        }

        if (dataType === STR) {
          value = inputValue;
        }

        if (dataType === BOOL) {
          value = e.currentTarget.checked;
        }

        // dataMap のkey:characterId な valueを変更
        await FSColumn.UpdateDataMap(columnId, [{ characterId, value }]);
      } catch (error) {
        /* ロールバック */
        e.currentTarget.value = cell.value;

        console.error(error);
        Notice.Log(error);
      }
    },
    async onInputHeader(e, column) {
      console.log("TableView.onInputHeader"); // @DELETEME
      const newLabel = e.currentTarget.value.trim();
      if (!newLabel) {
        e.currentTarget.value = column.label;
        e.currentTarget.blur();
        return false;
      }

      e.currentTarget.blur();
      await FSColumn.Update(column.id, { label: newLabel });
    },
    async onChangeColumnShow(columnId, show = false) {
      console.log("TableView.onChangeColumnShow", columnId, show); // @DELETEME
      await FSColumn.Update(columnId, { show });
    },
    filterWithHeader(cells) {
      const dispColumnIdList = this.columns
        .filter(c => c.system || c.show)
        .map(c => c.id);
      return cells.filter(c => dispColumnIdList.indexOf(c.columnId) !== -1);
    },
    async onClickAddColumn(dataType) {
      const roomId = this.room.id;
      await FSColumn.Create({
        roomId,
        tableId: this.tableId,
        label: dataType,
        dataType,
        refPath: dataType === REF ? "character.id" : null,
        dataMap: {}
      });
    }
  },
  computed: {
    characters() {
      return this.$store.getters["character/info"];
    },
    tableItems() {
      const matrixList = this.$store.getters["table/info"];
      return matrixList.map(t => ({ value: t.id, text: t.name }));
    },
    tableMatrix() {
      const { tableId } = this;
      if (!tableId) {
        return null;
      }
      const matrixList = this.$store.getters["table/matrixList"];
      return matrixList.find(t => t.id === tableId);
    },
    columns() {
      return (this.tableMatrix?.columns ?? []).filter(c => c.system || c.show);
    },
    allColumns() {
      return this.tableMatrix?.columns ?? [];
    },
    togglableColumns() {
      return this.allColumns.filter(c => !c.system);
    },
    rows() {
      return (this.tableMatrix?.rows ?? []).filter(r => r.show);
    },
    allRows() {
      return this.tableMatrix?.rows ?? [];
    },
    room() {
      return this.$store.getters["room/info"];
    }
  }
};
</script>

<style scoped></style>
