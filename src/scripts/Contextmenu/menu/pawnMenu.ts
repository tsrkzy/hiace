/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import {
  ContextMenuChildItem,
  ContextMenuItem
} from "@/scripts/Contextmenu/ContextMenu";
import store from "@/store";
import { getName } from "@/scripts/helper";
import { FSPawn } from "@/collections/Pawn";
import { CHARACTER_EDIT } from "@/interfaces/IFFloat";

export function pawnItems(pawnId: string): ContextMenuItem[] {
  const pawn = store.getters["pawn/info"].find(
    (p: { id: string }) => p.id === pawnId
  );

  if (!pawn) {
    throw new Error(`no pawn exists: ${pawnId}`);
  }
  const characterName: string = getName("character", pawn.character);

  const result: ContextMenuItem[] = [];

  /* コマを原点に戻す */
  const resetPosItem = new ContextMenuChildItem({
    value: `reset_pawn_${pawnId}`,
    text: `コマを原点に戻す`,
    callback: async () => {
      await FSPawn.ResetTransform([pawnId]);
    }
  });

  /* キャラクタ編集 */
  const editCharacterItem = new ContextMenuChildItem({
    value: `edit_pawn_character_${pawn.character}`,
    text: `キャラクタの編集(${characterName})`,
    callback: async () => {
      const contentId = CHARACTER_EDIT;
      const show = true;
      const args = { characterId: pawn.character };
      await store.dispatch("float/create", { contentId, show, args });
    }
  });

  /* コマ複製 */
  const copyPawnItem = new ContextMenuChildItem({
    value: `copy_pawn_${pawnId}`,
    text: "コマを複製する(未実装)",
    callback: async () => {},
    disabled: true
  });

  /* コマ削除 */
  const deletePawnItem = new ContextMenuChildItem({
    value: `delete_pawn_${pawnId}`,
    text: `コマの削除(${characterName})`,
    callback: async () => {
      await FSPawn.Delete(pawnId);
    }
  });

  result.push(resetPosItem);
  result.push(editCharacterItem);
  result.push(copyPawnItem);
  result.push(deletePawnItem);

  return result;
}
