/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { get } from "svelte/store";
import { ContextMenuItem } from "@/model/ContextMenu";
import { showContextMenuByMouseCursor } from "@/model/service/ContextMenu/helper";
import { useContextMenu } from "@/model/store/contextMenu";
import { openFloat } from "@/model/service/FloatService";
import { ContentId } from "@/model/Float";
import { usePawns } from "@/model/store/pawns";
import { clonePawn, deletePawn } from "@/model/service/PawnService";
import { Pawn } from "@/model/Pawn";

const { setContextMenuItems } = useContextMenu();

export const showPawnContextMenu = (e: MouseEvent, pawnId: string) => {
  const { pawns: _pawns } = usePawns();
  const pawns = get(_pawns);
  const pawnIdList = pawns.map(p => p.id);
  const pawn = pawns.find(p => p.id === pawnId) as Pawn;
  const { character: characterId } = pawn;

  console.log("ContextMenuService.showPawnContextMenu", e, pawnId);
  setContextMenuItems([
    new ContextMenuItem({
      text: "キャラクタの編集",
      id: `edit_pawn_character_${characterId}`,
      callback: () => {
        openFloat(ContentId.CHARACTER_EDIT, { args: { characterId } });
      },
    }),
    new ContextMenuItem({
      text: "コマを複製する",
      id: `copy_pawn_${pawnId}`,
      callback: async () => {
        await clonePawn({ pawnId });
      },
    }),
    new ContextMenuItem({
      text: "コマの削除",
      id: `delete_pawn_${pawnId}`,
      callback: async () => {
        await deletePawn({ pawnId });
      },
    }),
    new ContextMenuItem({
      text: "キャラクタを複製する",
      id: `copy_character_${characterId}`,
      callback: () => {},
    }),
    new ContextMenuItem({
      text: "キャラクタを控室へ隠す",
      id: `archive_character_${characterId}`,
      callback: () => {},
    }),
    new ContextMenuItem({
      text: "コマの大きさを変更する",
      id: `resize_pawn_${pawnId}`,
      children: [
        new ContextMenuItem({
          text: "小さくする",
          id: `resize_pawn_small_${pawnId}`,
          callback: () => {},
        }),
        new ContextMenuItem({
          text: "大きくする",
          id: `resize_pawn_large_${pawnId}`,
          callback: () => {},
        }),
      ],
    }),
    new ContextMenuItem({
      text: "線を引く/消す",
      id: `manage_line_${pawnId}`,
      children: pawnIdList
        .filter(_pawnId => _pawnId !== pawnId)
        .map(
          _pawnId =>
            new ContextMenuItem({
              text: `${_pawnId}へ引く`,
              id: `manage_line_${pawnId}_to_${_pawnId}`,
              callback: () => {
                console.log("manage_line", pawnId, _pawnId);
              },
            }),
        ),
    }),
    new ContextMenuItem({
      text: "コマの重ね順を一番下にする",
      id: `send_to_back_${pawnId}`,
      callback: () => {},
    }),
  ]);

  showContextMenuByMouseCursor(e);
};
