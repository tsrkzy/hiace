import { BOOL, INT, REF, STR } from "@/collections/Column";

export const table = {
  namespaced: true,
  state: {
    tables: []
  },
  mutations: {
    setTables(state, payload) {
      state.tables = payload.tables;
    }
  },
  actions: {
    setTables({ commit }, { tables }) {
      console.log("table.setTables", tables); // @DELETEME
      commit("setTables", { tables });
    }
  },
  getters: {
    info(state) {
      return state.tables;
    },
    nameMap(state) {
      const nameMap = {};
      for (let i = 0; i < state.tables.length; i++) {
        const id = state.tables[i].id;
        nameMap[id] = state.tables[i].name;
      }
      return nameMap;
    },
    matrixList(state, getters, rootState, rootGetters) {
      const { tables = [] } = state;
      const columns = rootGetters["column/info"];
      const characters = rootGetters["character/info"];
      const roomId = rootGetters["room/info"].id;
      /* テーブルデータの配列を作成 */
      const matrixList = [];
      for (let i = 0; i < tables.length; i++) {
        const t = tables[i];
        const m = {
          id: t.id,
          columns: [],
          rows: []
        };

        /* ヘッダの作成 */

        /* デフォルト列: character.idとcharacter.name */
        // const idColumn = {
        //   id: "system_id",
        //   system: true,
        //   roomId,
        //   tableId: t.id,
        //   label: "#id",
        //   dataType: REF,
        //   refPath: "character.id",
        //   dataMap: {}
        // };
        const nameColumn = {
          id: "system_name",
          system: true,
          roomId,
          tableId: t.id,
          label: "#name",
          dataType: REF,
          refPath: "character.name",
          dataMap: {}
        };
        m.columns.push(/*idColumn,*/ nameColumn);
        for (let j = 0; j < columns.length; j++) {
          const col = columns[j];
          if (col.table !== t.id) {
            continue;
          }
          m.columns.push(col);
        }

        /* キャラクタごとに行を作成 */
        for (let k = 0; k < characters.length; k++) {
          const character = characters[k];
          const row = {
            characterId: character.id,
            show: character.showOnInitiative,
            cells: []
          };
          /* 列要素を作成 */
          for (let j = 0; j < m.columns.length; j++) {
            const {
              id,
              system = false,
              dataType,
              refPath,
              dataMap
            } = m.columns[j];

            const cell = {
              columnId: id,
              system,
              characterId: character.id,
              value: null,
              dataType,
              refPath
            };
            if (dataType === REF) {
              /* characterの参照 */
              const [collection, field] = refPath.split(".");
              const infoList = rootGetters[`${collection}/info`];
              /* 今の所characterのみ */
              const info = infoList.find(i => i.id === character.id);
              cell.value = info[field];
            } else {
              const _v = dataMap[character.id];
              if (dataType === INT) {
                cell.value = parseInt(_v ?? 0, 10);
              } else if (dataType === STR) {
                cell.value = _v ?? "";
              } else if (dataType === BOOL) {
                cell.value = !!_v;
              }
            }
            row.cells.push(cell);
          }
          m.rows.push(row);
        }
        matrixList.push(m);
      }
      return matrixList;
    }
  }
};
