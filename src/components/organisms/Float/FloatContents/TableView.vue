<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <div>
      <ha-select
        :value="tableId"
        :items="tableItems"
        @change="onChangeTable($event)"
      >
        <option :value="null" disabled selected>テーブル選択</option>
      </ha-select>
      <ha-button @click="onCreateTable">作成</ha-button>
    </div>
    <table-config :table-id="tableId" v-model="sortConfig" />
    <div v-if="tableMatrix">
      <table style="width: 100%;">
        <thead>
          <tr>
            <th
              v-for="c in columns"
              :key="c.id"
              :class="
                `column--header 
                ${sortConfig === `${c.id}_asc` && 'column--header__asc'}
                ${sortConfig === `${c.id}_desc` && 'column--header__desc'}`
              "
            >
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
              <div
                v-if="cell.dataType === 'ref'"
                style="background-color: ghostwhite;text-overflow: ellipsis; white-space: nowrap; word-break: keep-all; "
                @contextmenu="onContextmenu($event, cell.characterId)"
              >
                {{ cell.value }}
              </div>
              <label v-else>
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
                  v-else-if="cell.dataType === 'str'"
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
import { BOOL, FSColumn, INT, STR } from "@/collections/Column";
import { FSTable } from "@/collections/Table";
import HaButton from "@/components/atoms/HaButton";
import HaSelect from "@/components/atoms/HaSelect";
import TableConfig from "@/components/organisms/Float/FloatContents/TableConfig";
import { showContext } from "@/scripts/Contextmenu";
import { tableCompare } from "@/scripts/helper";
import { Notify } from "@/scripts/Notify";
import { touchTable } from "@/scripts/touch";

export default {
  name: "TableView",
  components: { TableConfig, HaButton, HaSelect },
  props: {
    floatId: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      tableId: null,
      sortConfig: null
    };
  },
  methods: {
    onChangeTable(tableId) {
      this.tableId = tableId;
    },
    async onCreateTable() {
      this.sortConfig = null;
      const roomId = this.room.id;
      const table = await FSTable.CreateDefault({ roomId });
      this.tableId = table.id;
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

        touchTable(characterId, columnId, value);
      } catch (error) {
        /* ロールバック */
        e.currentTarget.value = cell.value;

        console.error(error);
        Notify.Log(error);
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
    filterWithHeader(cells) {
      const dispColumnIdList = this.columns
        .filter(c => c.system || c.show)
        .map(c => c.id);
      return cells.filter(c => dispColumnIdList.indexOf(c.columnId) !== -1);
    },
    onContextmenu(e, characterId) {
      console.log("TableView.onContextmenu", e, characterId);
      this.showContext(e, characterId);
    },
    showContext(e, characterId) {
      e.stopPropagation();
      e.preventDefault();
      showContext(e, "table_row", characterId);
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
      const matrix = matrixList.find(t => t.id === tableId);

      const sortConfig = this.sortConfig;
      if (!sortConfig) {
        return matrix;
      }

      // データ型
      const [col, order] = sortConfig.split("_");
      matrix.rows = matrix.rows.sort((rA, rB) => {
        const cA = rA.cells.find(c => c.columnId === col);
        const cB = rB.cells.find(c => c.columnId === col);
        const dataType = cA.dataType;
        const vA = cA.value;
        const vB = cB.value;
        return tableCompare(vA, vB, { type: dataType, order });
      });

      return matrix;
    },
    columns() {
      return (this.tableMatrix?.columns ?? []).filter(c => c.system || c.show);
    },
    rows() {
      return (this.tableMatrix?.rows ?? []).filter(r => r.show);
    },
    room() {
      return this.$store.getters["room/info"];
    }
  },
  watch: {
    tableItems(tableItems) {
      if (tableItems.findIndex(t => t.value === this.tableId) === -1) {
        this.tableId = null;
      }
    }
  }
};
</script>
