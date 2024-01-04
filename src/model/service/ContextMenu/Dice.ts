/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { useContextMenu } from "@/model/store/contextMenu";
import { ContextMenuItem } from "@/model/ContextMenu";
import { showContextMenuByMouseCursor } from "@/model/service/ContextMenu/helper";
import { DiceColors, DiceLabels, DiceValues } from "@/constant";
import {
  changeDiceColor,
  changeDiceFace,
  deleteDice,
  duplicateDice,
  rollDice,
} from "@/model/service/DiceService";

const { setContextMenuItems } = useContextMenu();

export const showDiceContextMenu = (e: MouseEvent, diceId: string) => {
  setContextMenuItems([
    new ContextMenuItem({
      text: "ダイスの目を変更",
      id: `change_face_${diceId}`,
      children: [
        DiceValues.ONE,
        DiceValues.TWO,
        DiceValues.THREE,
        DiceValues.FOUR,
        DiceValues.FIVE,
        DiceValues.SIX,
        DiceValues.ASTER,
      ].map(
        n =>
          new ContextMenuItem({
            text: `「${DiceLabels[n]}」に変更`,
            id: `change_face_${diceId}_${n}`,
            callback: async () => await changeDiceFace({ diceId, face: n }),
          }),
      ),
    }),
    new ContextMenuItem({
      text: "ダイスを振る",
      id: `roll_dice_${diceId}`,
      callback: async () => await rollDice({ diceId }),
    }),
    new ContextMenuItem({
      text: "ダイスの色を変更",
      id: `change_dice_color_${diceId}`,
      children: [
        DiceColors.DICE_WHITE,
        DiceColors.DICE_BLACK,
        DiceColors.DICE_RED,
        DiceColors.DICE_HALLOWEEN,
      ].map(
        c =>
          new ContextMenuItem({
            text: `「${c}」に変更`,
            id: `change_dice_color_${diceId}_${c}`,
            callback: async () => await changeDiceColor({ diceId, color: c }),
          }),
      ),
    }),
    new ContextMenuItem({
      text: "ダイスを追加",
      id: `create_dice_on_map_chip_${diceId}`,
      callback: async () => await duplicateDice({ diceId }),
    }),
    new ContextMenuItem({
      text: "ダイスを削除",
      id: `delete_dice_${diceId}`,
      callback: async () => await deleteDice({ diceId }),
    }),
  ]);

  showContextMenuByMouseCursor(e);
};
