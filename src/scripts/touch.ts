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
