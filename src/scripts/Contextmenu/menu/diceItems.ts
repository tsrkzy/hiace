/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import {
  ContextMenuChildItem,
  ContextMenuItem,
  ContextMenuParentItem,
} from "@/scripts/Contextmenu/ContextMenu";
import store from "@/store";
import {
  DICE_BLACK,
  DICE_RED,
  DICE_SIZE,
  DICE_WHITE,
  faceValueToLabel,
  FSDice,
  DICE_VALUE_ASTER,
  DICE_LABEL_ONE,
  DICE_LABEL_TWO,
  DICE_LABEL_THREE,
  DICE_LABEL_FOUR,
  DICE_LABEL_FIVE,
  DICE_LABEL_SIX,
  DICE_LABEL_ASTER,
  DICE_VALUE_ONE,
  DICE_VALUE_TWO,
  DICE_VALUE_THREE,
  DICE_VALUE_FOUR,
  DICE_VALUE_FIVE,
  DICE_VALUE_SIX,
  DICE_HALLOWEEN,
} from "@/collections/Dice";
import { touchFree } from "@/scripts/touch";
import { SYSTEM_CHANNEL_ID } from "@/collections/Channel";
import { FSChat } from "@/collections/Chat";

export function diceItems(diceId: string): ContextMenuItem[] {
  const boardId = store.getters["room/activeBoard"];

  if (!boardId) {
    throw new Error("no active-boardId found");
  }
  const roomId = store.getters["room/info"].id;
  const userId = store.getters["auth/user"].id;

  const dice = store.getters["dice/info"].find(
    (d: { id: string }) => d.id === diceId
  );
  const { face, color, transform: _transform } = dice;

  const result: ContextMenuItem[] = [];

  /* ダイスの面を変更 */
  const changeFace = new ContextMenuParentItem({
    value: `change_face_${diceId}`,
    text: `ダイスの目を変更`,
  });

  const faces = [
    [DICE_LABEL_ONE, DICE_VALUE_ONE],
    [DICE_LABEL_TWO, DICE_VALUE_TWO],
    [DICE_LABEL_THREE, DICE_VALUE_THREE],
    [DICE_LABEL_FOUR, DICE_VALUE_FOUR],
    [DICE_LABEL_FIVE, DICE_VALUE_FIVE],
    [DICE_LABEL_SIX, DICE_VALUE_SIX],
    [DICE_LABEL_ASTER, DICE_VALUE_ASTER],
  ];
  changeFace.children = faces.map((f) => {
    return new ContextMenuChildItem({
      value: `change_face_${f[0]}_${diceId}`,
      text: `「${f[0]}」`,
      callback: async () => {
        await FSDice.Update(diceId, { face: f[1] });
        const oldFace = faceValueToLabel(face);
        const msg = `ダイスの目を「${oldFace}」から「${f[0]}」に変更しました`;
        const chatParams = {
          room: roomId,
          channel: SYSTEM_CHANNEL_ID,
          owner: userId,
          character: null,
          alias: null,
          value: { text: msg },
        };
        await FSChat.Chat(chatParams);
        touchFree(msg);
      },
    });
  });

  /* ダイスを振る */
  const rollDice = new ContextMenuChildItem({
    value: `roll_dice_${diceId}`,
    text: `ダイスを振る`,
    callback: async () => {
      const { newFace: n, oldFace: o } = await FSDice.Roll(diceId);
      const msg = `ダイスを振り、「${o}」が「${n}」になりました`;
      const chatParams = {
        room: roomId,
        channel: SYSTEM_CHANNEL_ID,
        owner: userId,
        character: null,
        alias: null,
        value: { text: msg },
      };
      await FSChat.Chat(chatParams);
      touchFree(msg);
    },
  });

  /* ダイスの色を変更 */
  const changeColor = new ContextMenuParentItem({
    value: `change_color_${diceId}`,
    text: `ダイスの色を変更`,
  });

  const colors = [
    ["白", "DICE_WHITE", DICE_WHITE],
    ["黒", "DICE_BLACK", DICE_BLACK],
    ["赤", "DICE_RED", DICE_RED],
    ["ハロウィン", "DICE_HALLOWEEN", DICE_HALLOWEEN],
  ];
  changeColor.children = colors.map((c) => {
    return new ContextMenuChildItem({
      value: `change_color_${c[1]}_${diceId}`,
      text: `「${c[0]}」`,
      callback: async () => {
        await FSDice.Update(diceId, { color: c[2] });
        touchFree(`ダイスの色を${c[0]}に変更しました`);
      },
    });
  });

  /* ダイスを追加 */
  const createDiceItem = new ContextMenuChildItem({
    value: `create_dice_${diceId}`,
    text: "ダイスを追加",
    callback: async () => {
      const transform = new DOMMatrix(_transform);
      /* 座標をダイス1個分だけ右下にずらして作成 */
      transform.e += DICE_SIZE;
      transform.f += DICE_SIZE;
      await FSDice.Create({
        boardId,
        roomId,
        userId,
        face,
        color,
        transform,
      });
      touchFree(`ダイスを追加しました`);
    },
  });

  /* ダイスを削除 */
  const deleteDiceItem = new ContextMenuChildItem({
    value: `delete_dice_${diceId}`,
    text: "ダイスを削除",
    callback: async () => {
      await FSDice.Delete(diceId);
      touchFree(`ダイスを削除しました`);
    },
  });

  result.push(changeFace);
  result.push(rollDice);
  result.push(changeColor);
  result.push(createDiceItem);
  result.push(deleteDiceItem);

  return result;
}
