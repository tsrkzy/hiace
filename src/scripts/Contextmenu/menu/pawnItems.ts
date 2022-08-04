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
import { FSArrow } from "@/collections/Arrow";

export function pawnItems(pawnId: string): ContextMenuItem[] {
  const pawnList = store.getters["pawn/info"];
  const pawn = pawnList.find((p: { id: string }) => p.id === pawnId);
  if (!pawn) {
    throw new Error(`no pawn exists: ${pawnId}`);
  }

  const arrowList = store.getters["arrow/info"];
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
    text: "キャラクタを複製する",
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

  /* キャラクタを控室に入れる */
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
    text: `コマを大きくする`,
    callback: async () => {
      await FSCharacter.Update(character.id, { pawnSize: pawnSize + 1 });
    },
    disabled: pawnSize >= 8
  });
  changePawnSize.children.push(pawnSizeUp);

  /* コマを小さくする */
  const pawnSizeDown = new ContextMenuChildItem({
    value: `pawn_size_down_${pawnId}`,
    text: `コマを縮める`,
    callback: async () => {
      await FSCharacter.Update(character.id, { pawnSize: pawnSize - 1 });
    },
    disabled: pawnSize <= 1
  });
  changePawnSize.children.push(pawnSizeDown);

  /* Arrow作成 */
  const arrowMenu = new ContextMenuParentItem({
    value: `arrow_menu_${pawnId}`,
    text: "線"
  });

  /* 他のコマへ引く */
  for (let i = 0; i < pawnList.length; i++) {
    const { id: pawnIdTo, character: characterId } = pawnList[i];
    if (pawnId === pawnIdTo) {
      /* 自分自身には引かない */
      continue;
    }

    const character = store.getters["character/info"].find(
      (c: { id: string; archived: boolean }) => c.id === characterId
    );
    /* 控室のコマには引かない */
    if (character.archived) {
      continue;
    }

    /* 対象のコマとの間に既に同じ向きで存在する場合は非活性化 */
    const alreadyExists = arrowList.some(
      (a: { pawnFrom: string; pawnTo: string }) =>
        a.pawnFrom === pawnId && a.pawnTo === pawnIdTo
    );

    const pawnName = getName("pawn", pawnIdTo);

    const draw_arrow_to = new ContextMenuChildItem({
      value: `draw_arrow_to_${pawnId}_${pawnIdTo}`,
      text: `${pawnName}(${pawnIdTo.slice(0, 3)})へ引く`,
      callback: async () => {
        await FSArrow.Create({
          roomId,
          userId,
          pawnIdFrom: pawnId,
          pawnIdTo: pawnIdTo
        });
      },
      disabled: alreadyExists
    });
    arrowMenu.children.push(draw_arrow_to);
  }

  /* 対象のPawnに接続しているArrowをすべて消す */
  const existDeletable = arrowList.some(
    (a: { pawnFrom: string; pawnTo: string }) =>
      a.pawnFrom === pawnId || a.pawnTo === pawnId
  );
  const clear_arrows = new ContextMenuChildItem({
    value: `clear_arrows_${pawnId}`,
    text: `消す`,
    callback: async () => {
      await FSArrow.DeleteByPawn(pawnId);
    },
    disabled: !existDeletable
  });
  arrowMenu.children.push(clear_arrows);

  /* コマの重ね順を一番下にする */
  const toBottomPawnItem = new ContextMenuChildItem({
    value: `to_bottom_pawn_${pawnId}`,
    text: `コマの重ね順を一番下にする`,
    callback: async () => {
      await FSPawn.ToBottom(pawnId);
    }
  });

  result.push(resetPosItem);
  result.push(editCharacterItem);
  if (!archived) {
    result.push(archiveCharacterItem);
  }
  result.push(copyCharacterItem);
  result.push(copyPawnItem);
  result.push(deletePawnItem);
  result.push(changePawnSize);
  result.push(arrowMenu);
  result.push(toBottomPawnItem);

  return result;
}
