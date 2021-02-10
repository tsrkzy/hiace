/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import store from "@/store";
import { ContextMenuItem } from "@/scripts/Contextmenu/ContextMenu";
import { pawnItems } from "@/scripts/Contextmenu/menu/pawnMenu";

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
  const entityList = [PAWN];
  if (entityList.indexOf(entity) === -1) {
    throw new Error(`invalid entity: ${entity}`);
  }

  switch (entity) {
    case PAWN: {
      result = result.concat(pawnItems(entityId));
      break;
    }
  }

  return result;
}
