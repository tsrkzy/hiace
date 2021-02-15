/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import store from "@/store";
import { ContextMenuItem } from "@/scripts/Contextmenu/ContextMenu";
import { pawnItems } from "@/scripts/Contextmenu/menu/pawnMenu";
import { mapItems } from "@/scripts/Contextmenu/menu/mapMenu";
import { boardItems } from "@/scripts/Contextmenu/menu/boardItems";
import { diceItems } from "@/scripts/Contextmenu/menu/diceItems";
import { tableRowItems } from "@/scripts/Contextmenu/menu/tableRowMenu";

export const showContext = (
  e: MouseEvent,
  entity: string,
  entityId: string
) => {
  const itemGroups = getItemGroups(entity, entityId);
  if (!itemGroups || itemGroups.length === 0) {
    return;
  }

  const { pageX: x, pageY: y } = e;
  console.log("Room.showContext", x, y);
  store.dispatch("contextmenu/on", { x, y, itemGroups });
};

function getItemGroups(entity: string, entityId: string) {
  let result: ContextMenuItem[] = [];
  const PAWN = "pawn";
  const MAP = "map";
  const BOARD = "board";
  const DICE = "dice";
  const TABLE_ROW = "table_row";
  const entityList = [PAWN, MAP, BOARD, DICE, TABLE_ROW];
  if (entityList.indexOf(entity) === -1) {
    throw new Error(`invalid entity: ${entity}`);
  }

  switch (entity) {
    case PAWN: {
      result = result.concat(pawnItems(entityId));
      break;
    }
    case MAP: {
      result = result.concat(mapItems(entityId));
      break;
    }
    case BOARD: {
      result = result.concat(boardItems());
      break;
    }
    case DICE: {
      result = result.concat(diceItems(entityId));
      break;
    }
    case TABLE_ROW: {
      result = result.concat(tableRowItems(entityId));
      break;
    }
  }

  return result;
}
