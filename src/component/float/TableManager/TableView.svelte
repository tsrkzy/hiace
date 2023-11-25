<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useColumns } from "@/model/store/columns";
  import { useCharacters } from "@/model/store/characters";
  import { useRoom } from "@/model/store/room";
  import { type ColumnDataType, ColumnDataTypes } from "@/model/Column";
  import { Character } from "@/model/Character";

  export let tableId: string;

  const { columns: _columns } = useColumns();
  const { characters: _characters } = useCharacters();
  const { room } = useRoom();
  $: columns = $_columns.filter(c => c.table === tableId);
  $: characters = $_characters.filter(c => !c.archived && c.showOnInitiative);

  $: data = (() => {
    const roomId = $room.id;

    const colList: {
      id: string;
      system: boolean;
      roomId: string;
      label: string;
      dataType: ColumnDataType;
      refPath: string;
      dataMap: { [key: string]: string|number|boolean|null };
    }[] = [];
    const rowList: {
      characterId: string;
      cells: {
        columnId: string;
        system: boolean;
        characterId: string;
        value: string|number|boolean|null;
        dataType: ColumnDataType;
        refPath: string;
      }[];
    }[] = [];

    /* デフォルト列: character.idとcharacter.name */
    const idColumn = {
      id: "system_id",
      system: true,
      roomId,
      label: "#id",
      dataType: ColumnDataTypes.REF,
      refPath: "character.id",
      dataMap: {}
    };
    const nameColumn = {
      id: "system_name",
      system: true,
      roomId,
      label: "#name",
      dataType: ColumnDataTypes.REF,
      refPath: "character.name",
      dataMap: {},
    };
    colList.push(idColumn, nameColumn);
    for (let i = 0; i < columns.length; i++) {
      colList.push({
        system: false,
        id: columns[i].id,
        roomId: columns[i].room,
        label: columns[i].label,
        dataType: columns[i].dataType,
        refPath: columns[i].refPath,
        dataMap: columns[i].dataMap,
      });
    }

    /* キャラクタごとに行を作成 */
    for (let j = 0; j < characters.length; j++) {
      const character = characters[j];

      const row: {
        characterId: string, cells: {
          columnId: string;
          system: boolean;
          characterId: string;
          value: string|number|boolean|null;
          dataType: ColumnDataType;
          refPath: string;
        }[]
      } = {
        characterId: character.id,
        cells: [],
      };
      /* 列要素を作成 */
      for (let k = 0; k < colList.length; k++) {
        const {
          id,
          system = false,
          dataType,
          refPath,
          dataMap,
        } = colList[k];

        const cell: {
          columnId: string;
          system: boolean;
          characterId: string;
          value: string|number|boolean|null;
          dataType: ColumnDataType;
          refPath: string;
        } = {
          columnId: id,
          system,
          characterId: character.id,
          value: null,
          dataType,
          refPath,
        };
        if (dataType === ColumnDataTypes.REF) {
          /* characterの参照 */
          const field = refPath.split(".")[1];
          const c = characters.find((c) => c.id === character.id) as Character;
          if (field === "id") {

            cell.value = c.id;
          } else if (field === "name") {
            cell.value = c.name;
          } else {
            cell.value = "null";

          }
        } else {
          const _v = dataMap[character.id] as string|number|boolean|null;
          if (dataType === ColumnDataTypes.INT) {
            cell.value = parseInt(`${_v ?? 0}`, 10);
          } else if (dataType === ColumnDataTypes.STR) {
            cell.value = `${_v ?? ""}`;
          } else if (dataType === ColumnDataTypes.BOOL ) {
            cell.value = !!_v;
          }
        }
        row.cells.push(cell);
      }
      rowList.push(row);
    }

    return {
      columns: colList,
      rows: rowList,
    }
  })()
</script>

{#if tableId}
  <table>
    <thead>
    <tr>
      {#each data.columns as col (col.id)}
        <th>{col.label}</th>
      {/each}
    </tr>
    </thead>
    <tbody>
    {#each data.rows as column}
      <tr>
        {#each column.cells as cell (cell.columnId)}
          <td>{cell.value}</td>
        {/each}
      </tr>
    {/each}
    </tbody>
  </table>
{/if}