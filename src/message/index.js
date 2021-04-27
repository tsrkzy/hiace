/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export const HM_CHAT_DICE_LOG = "HM_CHAT_DICE_LOG";
export const HM_CHARACTER_ARCHIVE = "HM_CHARACTER_ARCHIVE";
export const HM_TABLE_COLUMN = "HM_TABLE_COLUMN";

export const HELP_MESSAGE = {
  [HM_CHAT_DICE_LOG]: {
    header: "チャット機能",
    content:
      "return: チャット送信\nshift+return: 改行を入力\n↑矢印: 直近10回分のBCDiceダイスヒストリを呼び出す"
  },
  [HM_CHARACTER_ARCHIVE]: {
    header: "控室",
    content: "控室のキャラクタはデータテーブル、コマ、立ち絵が非表示になる"
  },
  [HM_TABLE_COLUMN]: {
    header: "列",
    content:
      "数値、文字列、真偽値のいずれかを指定する\n1つのみをソート用の列として指定可能"
  }
};
