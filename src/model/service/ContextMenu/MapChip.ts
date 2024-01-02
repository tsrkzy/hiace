/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { ContextMenuItem } from "@/model/ContextMenu";
import { showContextMenuByMouseCursor } from "@/model/service/ContextMenu/helper";
import { useContextMenu } from "@/model/store/contextMenu";
import { openFloat } from "@/model/service/FloatService";
import { ContentId } from "@/model/Float";
import { deleteMapChip, updateMapChip } from "@/model/service/MapChipService";
import { createDice } from "@/model/service/DiceService";
import { useRoom } from "@/model/store/room";
import { get } from "svelte/store";
import { useUsers } from "@/model/store/users";
import { DiceColors } from "@/constant";

const { setContextMenuItems } = useContextMenu();

export const showMapChipContextMenu = (e: MouseEvent, mapChipId: string) => {
  const { room } = useRoom();
  const roomId = get(room).id;
  const boardId = get(room).activeBoard;
  const { myUserId } = useUsers();
  const userId = get(myUserId);

  console.log("ContextMenuService.mapChipContextMenu", e, mapChipId);
  setContextMenuItems([
    new ContextMenuItem({
      text: "マップの編集",
      id: `edit_map_chip_${mapChipId}`,
      callback: () => {
        openFloat(ContentId.MAP_EDIT, { args: { mapChipId } });
      },
    }),
    new ContextMenuItem({
      text: "マップの削除",
      id: `delete_map_chip_${mapChipId}`,
      callback: async () => {
        await deleteMapChip({ mapChipId });
      },
    }),
    new ContextMenuItem({
      text: "マップの位置を固定する",
      id: `toggle_map_chip_drag_lock_${mapChipId}`,
      callback: async () => {
        await updateMapChip({ mapChipId, criteria: { dragLock: true } });
      },
    }),
    new ContextMenuItem({
      text: "マップを移動可能にする",
      id: `toggle_map_chip_drag_unlock_${mapChipId}`,
      callback: async () => {
        await updateMapChip({ mapChipId, criteria: { dragLock: false } });
      },
    }),
    new ContextMenuItem({
      text: "ダイスを追加",
      id: `create_dice_on_map_chip_${mapChipId}`,
      children: [
        new ContextMenuItem({
          text: "白", id: `create_white_dice_${mapChipId}`, callback: async () => {
            await createDice({ roomId, boardId, userId, color: DiceColors.DICE_WHITE });
          },
        }),
        new ContextMenuItem({
          text: "黒", id: `create_black_dice_${mapChipId}`, callback: async () => {
            await createDice({ roomId, boardId, userId, color: DiceColors.DICE_BLACK });
          },
        }),
        new ContextMenuItem({
          text: "赤", id: `create_red_dice_${mapChipId}`, callback: async () => {
            await createDice({ roomId, boardId, userId, color: DiceColors.DICE_RED });
          },
        }),
        new ContextMenuItem({
          text: "ハロウィン", id: `create_haloween_dice_${mapChipId}`, callback: async () => {
            await createDice({ roomId, boardId, userId, color: DiceColors.DICE_HALLOWEEN });
          },
        })
      ]
    }),
  ]);

  showContextMenuByMouseCursor(e);
};
