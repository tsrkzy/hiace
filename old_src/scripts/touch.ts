/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { getName } from "@/scripts/helper";
import { Socket, TOUCH } from "@/scripts/Socket";
import store from "@/store";

export function touch(targetName: string, entity: string, entityId: string) {
  const userName = store.getters["auth/whoAmI"];
  const entityName = getName(entity, entityId);
  const message = `${userName}が${targetName}(${entityName})を操作しました`;
  Socket.Send(TOUCH, { message });
}

export function touchTable(characterId: string, columnId: string, value: any) {
  const userName = store.getters["auth/whoAmI"];
  const characterName = getName("character", characterId);
  const columnName = getName("column", columnId);
  const valueStr = `${value}`;
  const message = `${userName}が「${characterName}」の「${columnName}」を「${valueStr}」に変更しました`;
  Socket.Send(TOUCH, { message });
}

export function touchFree(msg: string) {
  const userName = store.getters["auth/whoAmI"];
  const message = `${userName}が${msg}`;
  Socket.Send(TOUCH, { message });
}
