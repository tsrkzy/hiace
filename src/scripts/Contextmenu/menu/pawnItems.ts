/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import {
  ContextMenuChildItem,
  ContextMenuItem,
  ContextMenuParentItem
} from "@/scripts/Contextmenu/ContextMenu";
import store from "@/store";
import { getName } from "@/scripts/helper";
import { FSPawn, PAWN_UNIT_SIZE } from "@/collections/Pawn";
import { CHARACTER_EDIT } from "@/interfaces/IFFloat";
import { FSCharacter } from "@/collections/Character";

export function pawnItems(pawnId: string): ContextMenuItem[] {
  const pawn = store.getters["pawn/info"].find(
    (p: { id: string }) => p.id === pawnId
  );
  if (!pawn) {
    throw new Error(`no pawn exists: ${pawnId}`);
  }
  const character = store.getters["character/info"].find(
    (c: { id: string }) => c.id === pawn.character
  );
  if (!character) {
    throw new Error(`no character exists: ${character.id}`);
  }
  const { pawnSize, archived } = character;
  const {
    room: roomId,
    owner: userId,
    board: boardId,
    image: imageId,
    character: characterId,
    transform: _transform
  } = pawn;

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

  /* キャラクタを複製 */
  const copyCharacterItem = new ContextMenuChildItem({
    value: `copy_character_${pawnId}`,
    text: "キャラクターを複製する",
    callback: async () => {
      const characterId = pawn.character;
      const character = await FSCharacter.Duplicate(characterId);
      const transform = new DOMMatrix(_transform);
      transform.e += pawnSize * PAWN_UNIT_SIZE;
      transform.f += pawnSize * PAWN_UNIT_SIZE;
      await FSPawn.Create({
        roomId,
        userId,
        boardId,
        imageId,
        characterId: character.id,
        transform
      });
    }
  });

  /* キャラクターを控室に入れる */
  const archiveCharacterItem = new ContextMenuChildItem({
    value: `archive_character_${pawnId}`,
    text: `控室に入れて隠す`,
    callback: async () => {
      await FSCharacter.Update(characterId, { archived: true });
    }
  });

  /* コマ複製 */
  const copyPawnItem = new ContextMenuChildItem({
    value: `copy_pawn_${pawnId}`,
    text: "コマを増やす",
    callback: async () => {
      const transform = new DOMMatrix(_transform);
      transform.e += pawnSize * PAWN_UNIT_SIZE;
      transform.f += pawnSize * PAWN_UNIT_SIZE;
      await FSPawn.Create({
        roomId,
        userId,
        boardId,
        imageId,
        characterId,
        transform
      });
    }
  });

  /* コマ削除 */
  const deletePawnItem = new ContextMenuChildItem({
    value: `delete_pawn_${pawnId}`,
    text: `コマの削除(${characterName})`,
    callback: async () => {
      await FSPawn.Delete(pawnId);
    }
  });

  /* コマの大きさ変更 */
  const changePawnSize = new ContextMenuParentItem({
    value: `change_pawn_size_${pawnId}`,
    text: "コマの大きさを変更する"
  });

  /* コマを大きくする */
  const pawnSizeUp = new ContextMenuChildItem({
    value: `pawn_size_up_${pawnId}`,
    text: `コマを大きくする(${characterName})`,
    callback: async () => {
      await FSCharacter.Update(character.id, { pawnSize: pawnSize + 1 });
    },
    disabled: pawnSize >= 8
  });
  changePawnSize.children.push(pawnSizeUp);

  /* コマを小さくする */
  const pawnSizeDown = new ContextMenuChildItem({
    value: `pawn_size_down_${pawnId}`,
    text: `コマを縮める(${characterName})`,
    callback: async () => {
      await FSCharacter.Update(character.id, { pawnSize: pawnSize - 1 });
    },
    disabled: pawnSize <= 1
  });
  changePawnSize.children.push(pawnSizeDown);

  result.push(resetPosItem);
  result.push(editCharacterItem);
  if (!archived) {
    result.push(archiveCharacterItem);
  }
  result.push(copyCharacterItem);
  result.push(copyPawnItem);
  result.push(deletePawnItem);
  result.push(changePawnSize);

  return result;
}
