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
import {
  DICE_BLACK,
  DICE_RED,
  DICE_SIZE,
  DICE_WHITE,
  FSDice
} from "@/collections/Dice";
import { touchFree } from "@/scripts/touch";

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
    text: `ダイスの目を変更`
  });

  const faces = [
    [1, "ONE"],
    [2, "TWO"],
    [3, "THREE"],
    [4, "FOUR"],
    [5, "FIVE"],
    [6, "SIX"],
    ["*", "*"]
  ];
  changeFace.children = faces.map(f => {
    return new ContextMenuChildItem({
      value: `change_face_${f[0]}_${diceId}`,
      text: `「${f[0]}」`,
      callback: async () => {
        await FSDice.Update(diceId, { face: f[1] });
        touchFree(`ダイスの目を${f[0]}に変更しました`);
      }
    });
  });
  /* ダイスの色を変更 */
  const changeColor = new ContextMenuParentItem({
    value: `change_color_${diceId}`,
    text: `ダイスの色を変更`
  });

  const colors = [
    ["白", DICE_WHITE],
    ["黒", DICE_BLACK],
    ["赤", DICE_RED]
  ];
  changeColor.children = colors.map(c => {
    return new ContextMenuChildItem({
      value: `change_color_${c[1]}_${diceId}`,
      text: `「${c[0]}」`,
      callback: async () => {
        await FSDice.Update(diceId, { color: c[1] });
        touchFree(`ダイスの色を${c[0]}に変更しました`);
      }
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
        transform
      });
      touchFree(`ダイスを追加しました`);
    }
  });

  /* ダイスを削除 */
  const deleteDiceItem = new ContextMenuChildItem({
    value: `delete_dice_${diceId}`,
    text: "ダイスを削除",
    callback: async () => {
      await FSDice.Delete(diceId);
      touchFree(`ダイスを削除しました`);
    }
  });

  result.push(changeFace);
  result.push(changeColor);
  result.push(createDiceItem);
  result.push(deleteDiceItem);

  return result;
}
