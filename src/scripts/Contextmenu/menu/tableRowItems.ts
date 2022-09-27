/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import {
  ContextMenuChildItem,
  ContextMenuItem,
} from "@/scripts/Contextmenu/ContextMenu";
import store from "@/store";
import { getName } from "@/scripts/helper";
import { FSCharacter } from "@/collections/Character";
import { Smoke } from "@/scripts/Smoke";

export function tableRowItems(characterId: string): ContextMenuItem[] {
  const character = store.getters["character/info"].find(
    (m: { id: string }) => m.id === characterId
  );

  if (!character) {
    throw new Error(`no character exists: ${characterId}`);
  }

  const result: ContextMenuItem[] = [];

  /* キャラクタをテーブルで隠す */
  const characterName = getName("character", characterId);
  const hideOnInitiative = new ContextMenuChildItem({
    value: `hide_character_in_table_${characterId}`,
    text: `テーブルには非表示(${characterName})`,
    callback: async () => {
      await Smoke.on();
      await FSCharacter.Update(characterId, { showOnInitiative: false });
      await Smoke.off();
    },
  });

  result.push(hideOnInitiative);

  return result;
}
